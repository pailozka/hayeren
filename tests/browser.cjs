// Run with PLAYWRIGHT_MODULE pointing to an installed Playwright package.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({headless:true});
 const page = await browser.newPage({viewport:{width:1280,height:900}, reducedMotion:'reduce', timezoneId:'Europe/Prague'});
 await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort());
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000');
 await page.evaluate(() => {localStorage.clear();}); await page.reload();
 assert.equal(await page.evaluate(()=>loadStreak().currentStreak),0, 'Opening app is not study');
 await page.setViewportSize({width:320,height:560});
 await page.getByRole('button',{name:'Start a short lesson'}).click();
 assert.ok(!await page.locator('.nav-tabs').isVisible(),'The lesson has a dedicated action bar');
 const action = await page.locator('#lessonContinue').boundingBox();
 assert.ok(action.y+action.height<=560 && action.y>=0,'Lesson action stays in view on a short phone');
 for(let i=0;i<6;i++) await page.locator('#lessonContinue').click();
 const answer=await page.evaluate(()=>{const t=lessonState.queue[lessonState.index]; return lessonAnswer(lessonItems(lessonState.unit)[t.item],t.reverse);});
 const wrong=page.locator('.lesson-option').filter({hasNotText:answer}).first();
 await wrong.click();
 assert.equal(await page.evaluate(()=>lessonState.queue.length),13);
 await page.getByRole('status').filter({hasText:'Correct answer:'}).waitFor();
 assert.equal(await page.locator('#lessonContinue').evaluate(button=>button===document.activeElement),true);
 const answeredAction=await page.locator('#lessonContinue').boundingBox();
 assert.ok(answeredAction.y+answeredAction.height<=560,'Feedback does not push Continue out of view');
 await page.reload();
 assert.equal(await page.locator('.lesson-option:disabled').count(),4,'Answered state survives reload');
 await page.locator('#lessonContinue').click();
 let guard=0;
 while (!await page.evaluate(()=>lessonState.finished) && guard++<30) {
  const expected=await page.evaluate(()=>{const t=lessonState.queue[lessonState.index]; return lessonAnswer(lessonItems(lessonState.unit)[t.item],t.reverse);});
  await page.getByRole('button',{name:expected,exact:true}).click();
  await page.locator('#lessonContinue').click();
 }
 assert.ok(await page.evaluate(()=>lessonState.finished));
 assert.equal(await page.evaluate(()=>Object.keys(loadSrsData()).length),6);
 assert.equal(await page.evaluate(()=>getSrsRecord('letter','ayb').lapses),1);
 assert.equal(await page.evaluate(()=>loadStreak().currentStreak),1);
 assert.equal(await page.evaluate(()=>getDueItems().length),0,'Completed items are due tomorrow, not today');
 assert.equal(await page.evaluate(()=>addDays('2026-03-29',1)),'2026-03-30','DST does not shift a due date');
 await page.reload();
 assert.equal(await page.evaluate(()=>getSrsRecord('letter','ayb').lapses),1,'Reload must not rate twice');
 await page.getByRole('button',{name:'Another lesson'}).click();
 assert.equal(await page.evaluate(()=>lessonState.unit),1);
 await page.setViewportSize({width:1280,height:900});
 await page.evaluate(()=>showPanel('daily'));
 await page.evaluate(()=>window.scrollTo({top:650,behavior:'instant'}));
 const before=await page.evaluate(()=>window.scrollY);
 const clickTab = async name => {
  const box=await page.locator(`[data-panel="${name}"]`).boundingBox();
  await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
 };
 await clickTab('alphabet');
 await clickTab('daily');
 assert.ok(Math.abs(before-await page.evaluate(()=>window.scrollY))<3,'Return restores scroll');
 assert.equal(await page.locator('#daySelector').evaluate(e=>getComputedStyle(e).position),'static');
 const header=page.locator('.session-header').first();
 await header.click(); assert.equal(await header.getAttribute('aria-expanded'),'false');
 await header.press('Enter'); assert.equal(await header.getAttribute('aria-expanded'),'true');
 assert.equal(await page.locator('.session-body').first().evaluate(e=>e.inert),false);
 await page.locator('[data-panel="alphabet"]').click(); await page.goBack();
 assert.equal(await page.locator('.panel.active').getAttribute('id'),'panel-daily');
 await page.evaluate(()=>showPanel('home'));
 await page.getByRole('link',{name:'Practice a conversation'}).click();
 await page.getByRole('button',{name:/Meet someone/}).click();
 await page.getByRole('button',{name:'ես',exact:true}).click();
 await page.getByRole('button',{name:'Check reply'}).click();
 await page.getByRole('status').filter({hasText:'Try again'}).waitFor();
 for (const words of [['Բարև','ձեզ'],['Անունս','Արամ','է']]) {
  for (const word of words) await page.getByRole('button',{name:word,exact:true}).click();
  await page.getByRole('button',{name:'Check reply'}).click();
  await page.getByRole('button',{name:'Continue'}).click();
 }
 await page.getByRole('status').filter({hasText:'Conversation complete'}).waitFor();
 await page.reload();
 await page.getByRole('button',{name:/Meet someone.*Completed/}).waitFor();
 for (const [title, replies] of [
  ['Order at a café', [['Ջուր','խնդրեմ'], ['Հաշիվը','խնդրեմ']]],
  ['Ask someone to repeat', [['Չեմ','հասկանում'], ['Կարո՞ղ','եք','կրկնել']]],
 ]) {
  await page.getByRole('button',{name:new RegExp(title)}).click();
  for (const words of replies) {
   for (const word of words) await page.getByRole('button',{name:word,exact:true}).click();
   await page.getByRole('button',{name:'Check reply'}).click();
   await page.getByRole('button',{name:'Continue'}).click();
  }
  await page.getByRole('status').filter({hasText:'Conversation complete'}).waitFor();
  await page.getByRole('button',{name:'Choose a conversation'}).click();
 }
 for(const width of [1280,390,320]) {
  await page.setViewportSize({width,height:844});
  for(const panel of ['home','daily','alphabet','quiz','flashcards','phrases','calendar','resources','review','lesson','dialogue','practice']) {
   await page.evaluate(name=>showPanel(name),panel);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),`No overflow: ${panel} ${width}`);
  }
 }
 await page.getByRole('button',{name:'Practice',exact:true}).click();
 await page.getByRole('button',{name:/^Quiz/}).click();
 assert.equal(await page.getByRole('button',{name:'Practice',exact:true}).getAttribute('aria-current'),'true');
 await page.locator('.skip-link').focus();
 await page.locator('.skip-link').press('Enter');
 assert.equal(await page.locator('.panel.active').getAttribute('id'),'panel-quiz');
 await page.evaluate(()=>showPanel('daily'));
 await page.evaluate(()=>scrollTo({top:400,behavior:'instant'}));
 const navBox=await page.locator('.nav-tabs').boundingBox();
 assert.ok(Math.abs(navBox.y+navBox.height-844)<2,'Mobile tabs remain at the bottom while scrolling');
 for (const tab of await page.locator('.nav-tabs .tab-btn').all()) {
  const rect=await tab.boundingBox();
  assert.ok(rect.x>=0 && rect.x+rect.width<=320 && rect.height>=44,'Every mobile tab is within easy reach');
 }
 await page.evaluate(()=>showPanel('home'));
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:'/tmp/hayeren-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log('PASS: lesson retry, persistence, SRS, keyboard accordion, scroll restoration, history, conversation retry and completion, and 36 responsive panel checks, and mobile navigation.');
})().catch(e=>{console.error(e);process.exit(1)});
