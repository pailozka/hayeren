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
 await page.getByRole('button',{name:'Բարև',exact:true}).click();
 await page.reload();
 await page.getByRole('button',{name:/Meet someone.*Continue where you left off/}).click();
 assert.equal(await page.locator('#dialogueSelection').textContent(),'Բարև');
 await page.getByRole('button',{name:'Restart'}).click();
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
 await page.locator('#programDays summary').click();
 await page.getByRole('button',{name:'3',exact:true}).click();
 assert.match(await page.locator('#dayHeading').textContent(), /^Day 3/);
 assert.equal(await page.locator('#programDays').evaluate(details=>details.open),false);
 await page.locator('#previousDay').click();
 assert.match(await page.locator('#dayHeading').textContent(), /^Day 2/);
 await page.locator('.session-block').first().getByRole('button',{name:'Mark Session Complete'}).click();
 await page.getByRole('button',{name:'Next session'}).click();
 assert.equal(await page.locator('.session-header').nth(1).getAttribute('aria-expanded'),'true');

 await page.evaluate(()=>showPanel('phrases'));
 const search = page.getByRole('searchbox',{name:'Search phrases'});
 await search.fill('բարի լույս');
 assert.equal(await page.locator('.phrase-card').count(),1);
 await search.fill('bari luys');
 assert.equal(await page.locator('.phrase-card').count(),1);
 await search.fill('good morning');
 await page.getByRole('button',{name:'Save phrase: Good morning'}).click();
 await page.reload();
 await page.getByRole('button',{name:'Saved (1)'}).click();
 assert.equal(await page.locator('.phrase-card').count(),1);
 await page.locator('.phrase-details summary').press('Enter');
 assert.equal(await page.locator('.phrase-details').evaluate(details=>details.open),true);
 await page.getByRole('button',{name:'Save phrase: Good morning'}).click();
 await page.getByText('Save a phrase to find it here later.').waitFor();

 await page.evaluate(()=>showPanel('review'));
 await page.getByRole('button',{name:'Learn 10 new'}).click();
 await page.evaluate(()=>showPanel('home'));
 await page.evaluate(()=>showPanel('review'));
 await page.getByRole('button',{name:'Learn 10 new'}).click();
 await page.getByRole('button',{name:'Reveal'}).click();
 await page.getByRole('button',{name:/Got it/}).click();
 assert.equal(await page.evaluate(()=>getNewIntroducedToday()),1);
 await page.evaluate(()=>showPanel('home'));
 await page.evaluate(()=>showPanel('review'));
 await page.getByRole('button',{name:'Learn 9 new'}).waitFor();

 await page.evaluate(() => {
  const records = loadSrsData();
  for (const key of ['letter:ayb', 'word:w001']) {
   records[key] = {...newSrsRecord(), due:isoToday()};
  }
  saveSrsData(records);
  showPanel('home');
  showPanel('review');
 });
 assert.equal(await page.locator('#reviewLetterAudio').count(),0);
 await page.getByRole('button',{name:'Reveal'}).click();
 const audioButton = page.getByRole('button',{name:'Hear the letter name Ayb'});
 const reviewBeforeAudio = await page.evaluate(()=>JSON.stringify(loadSrsData()));
 await audioButton.press('Enter');
 assert.match(await page.evaluate(()=>_alphaAudio.src), /audio\/letters\/ayb\.mp3$/);
 assert.equal(await page.evaluate(()=>JSON.stringify(loadSrsData())),reviewBeforeAudio);
 assert.equal(await audioButton.getAttribute('aria-label'),'Hear the letter name Ayb');
 await page.evaluate(() => {
  _alphaAudio.play = () => Promise.reject(new DOMException('Test audio failure','NotSupportedError'));
 });
 await audioButton.click();
 await page.getByText('Audio unavailable. You can still rate this card.').waitFor();
 await page.getByRole('button',{name:/Got it/}).click();
 assert.equal(await page.evaluate(()=>_alphaAudio.paused),true);
 await page.getByRole('button',{name:'Reveal'}).click();
 assert.equal(await page.locator('#reviewLetterAudio').count(),0);

 await page.evaluate(()=>showPanel('alphabet'));
 const ayb = page.getByRole('button',{name:'Study Ayb',exact:true});
 await ayb.press('Enter');
 const letterDialog = page.getByRole('dialog',{name:'Ayb'});
 await letterDialog.waitFor();
 const mark = letterDialog.getByRole('button',{name:'Mark Ayb as learned'});
 await mark.click();
 assert.equal(await mark.getAttribute('aria-pressed'),'true');
 await page.keyboard.press('Escape');
 assert.equal(await letterDialog.count(),0);
 assert.equal(await page.getByRole('button',{name:'Study Ayb, learned'}).evaluate(btn=>btn===document.activeElement),true);
 await page.getByRole('button',{name:'Study Ayb, learned'}).click();
 await page.goBack();
 assert.equal(await page.locator('#letterDialog').evaluate(dialog=>dialog.open),false);

 await page.evaluate(()=>showPanel('quiz'));
 await page.getByRole('button',{name:'Words',exact:true}).click();
 const wordCount = await page.evaluate(()=>wordQuizItems.length);
 for (let index=0; index<wordCount; index++) {
  const answer = await page.evaluate(()=>{
   const word = wordQuizItems[wordQuizIndex];
   return wordQuizIndex % 2 ? word.arm : word.eng;
  });
  await page.getByRole('button',{name:answer,exact:true}).click();
  if (!index) {
   await page.evaluate(()=>showPanel('home'));
   await page.evaluate(()=>showPanel('quiz'));
   assert.equal(await page.locator('#quizScore').textContent(),'Score: 1/1');
  }
  await page.locator('#nextBtn').click();
 }
 assert.equal(await page.locator('#quizScore').textContent(), `Final: ${wordCount}/${wordCount}`);
 await page.locator('#nextBtn').click();
 assert.equal(await page.locator('#quizScore').textContent(),'Score: 0/0');
 await page.getByRole('button',{name:'Letters',exact:true}).click();
 await page.getByRole('button',{name:'Type it',exact:true}).click();
 const letterCount = await page.evaluate(()=>quizLetters.length);
 for (let index=0; index<letterCount; index++) {
  const answer = await page.evaluate(()=>acceptableAnswers(quizLetters[quizIndex].sound)[0]);
  const input = page.getByRole('textbox',{name:'Your answer'});
  await input.fill(answer);
  await input.press('Enter');
  await page.locator('#nextBtn').click();
 }
 assert.equal(await page.locator('#quizScore').textContent(), `Final: ${letterCount}/${letterCount}`);
 await page.locator('#nextBtn').click();
 await page.getByRole('textbox',{name:'Your answer'}).waitFor();

 await page.evaluate(()=>showPanel('home'));
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await page.screenshot({path:'/tmp/hayeren-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log('PASS: lesson retry, persistence, SRS, keyboard accordion, scroll restoration, history, conversation retry and completion, 36 responsive panel checks, mobile navigation, Program continuation, phrase search and saving, Review allowance, keyboard alphabet dialog, full quiz rounds, and review letter audio.');
})().catch(e=>{console.error(e);process.exit(1)});
