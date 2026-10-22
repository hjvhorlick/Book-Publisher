/* ────────────────────────────────────────────────────────────
   Book Publisher — application logic
   Vanilla JS, no build step. Everything persists in localStorage.
   ──────────────────────────────────────────────────────────── */
'use strict';

(() => {
  const STORAGE_KEY = 'bookpublisher.v1';
  const THEME_KEY = 'bookpublisher.theme';
  const WORDS_PER_PAGE = 205;

  const ACCENTS = [
    { name: 'Gold', value: '#cfa14a' },
    { name: 'Terracotta', value: '#c2633f' },
    { name: 'Forest', value: '#3f7d5a' },
    { name: 'Indigo', value: '#44507f' },
    { name: 'Plum', value: '#7a4a6d' },
    { name: 'Slate', value: '#4b5763' },
    { name: 'Crimson', value: '#a33a3a' }
  ];

  /* ── Utilities ─────────────────────────────────────────── */

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  const countWords = (text) =>
    (String(text || '').trim().match(/[\p{L}\p{N}'’\-]+/gu) || []).length;

  const readingMinutes = (words) => Math.max(0, Math.round(words / 225));

  const escapeHtml = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const inline = (text) => escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])_([^_]+)_(?=[\s.,;:!?)]|$)/g, '$1<em>$2</em>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');

  const debounce = (fn, wait) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const $ = (sel) => document.querySelector(sel);

  /* ── Seed data ─────────────────────────────────────────── */

  function sampleBook() {
    return {
      id: uid(),
      title: 'The Lantern Keeper',
      subtitle: 'A novel of small lights and long nights',
      author: 'A. M. Hollis',
      genre: 'Literary fiction',
      description: 'On an island where the lighthouse has gone dark, a keeper must decide what she is willing to burn to bring the ships home.',
      accent: ACCENTS[0].value,
      goal: 900,
      chapters: [
        {
          id: uid(),
          title: 'The Lamp Goes Out',
          body: `The lamp failed at ten past three, and Mara knew before she opened her eyes. There is a particular silence that comes when the light stops turning — as though the island itself exhales and decides to keep the breath.

She climbed the ninety-two steps with her shawl wrapped twice around her shoulders. The glass was cold. The wick was gone. In its place sat a small, perfect pool of salt water, and beside it, a feather.

Mara had kept the light for eleven years. She had kept it through storms that took the roofs off the village, through winters when the coal came late, through the long argument with the mainland about whether a light was a luxury. Nobody had ever put the sea *inside* the lantern.

She picked up the feather. It was grey, and heavier than it had any right to be.

Outside, the fog was coming in — thick, deliberate, the colour of unwashed wool. Somewhere beyond it, the mail boat was due, and behind the mail boat, three trawlers with men who trusted the light.

"Right," she said, to nobody, to the lamp. "Then we do it the old way."`,
        },
        {
          id: uid(),
          title: 'What the Fog Carries',
          body: `The old way meant fire on the headland, which meant fuel, which meant the winter store, which meant explaining herself at the end of the month to a committee that had never once climbed the stairs.

Mara took the barrow down to the shed. The fog had a sound to it that afternoon: not the foghorn, which she had silenced out of spite three summers ago, but a low, patient knocking, as though someone were tapping at the door of the world and waiting to be let in.

She loaded the barrow with driftwood and two tins of paraffin and a length of rope she did not remember buying.

> The sea gives back what it is finished with. It is not a kindness. It is only housekeeping.

By four o'clock the fire was built on the black rock above the landing, and the village had begun to gather. They came without being called — Ellery with his bad hip, the two Rossiter girls carrying a kettle, old Tomas saying nothing at all — and they stood with their backs to the wind and watched her strike the match.

The flame caught, and the fog leaned in to look at it.

"It won't be enough," said Tomas.

"It never was," Mara said. "That's not what it's for."`,
        },
        {
          id: uid(),
          title: 'Small Lights',
          body: `The mail boat came in at dusk, four hours late and full of apologies. The trawlers came after, one by one, feeling their way along the coast the way a hand feels along a wall in a dark house. Nobody ran aground that night. Nobody thanked her, either, which was how she preferred it.

Afterwards, when the fire had burned down to embers and the village had gone home, Mara sat on the black rock with the grey feather in her lap.

She thought about the lamp, and the salt water, and the small, unreasonable stubbornness of keeping a light for people she would never meet.

She thought: *a light is not a thing you have. It is a thing you do, over and over, in the dark, until someone sees it.*

In the morning she would climb the ninety-two steps again and begin the slow work of rebuilding the wick. The sea would complain. The committee would write letters. The fog would come back, as fog does, patient and grey and full of knocking.

But tonight there were three boats in the harbour, and one small fire on the headland, and that was enough.

That was, in fact, the whole of it.`,
        },
        {
          id: uid(),
          title: 'The Committee Writes Back',
          body: `The letter arrived on a Tuesday, which was the committee's usual day for small cruelties.

> Dear Keeper, — It has been brought to our attention that the light was extinguished for a period of some four hours on the fourteenth. We remind you that the light is a public asset. We remind you that the fuel allowance is not a discretionary fund. We remind you, finally, that the position of keeper is a privilege extended, not a right held.

Mara read it twice, then pinned it to the wall beside the ninety-two steps, where the draught made it flap like something trying to leave.

Ellery came up at noon with bread and the news that the Rossiter girls had painted a small red mark on the harbour wall — a lantern, badly drawn, unmistakable. Two fishermen had already asked whether they might have one for their boats. Tomas, who had never in his life asked for anything, had asked.

She wrote back that evening, in her best hand.

> Gentlemen, — The lamp failed. The sea was in it. I burned the winter store on the headland and three boats came home that would not otherwise have done. If the light is a public asset, then so is the fog. I await your instructions as to which of the two you would like me to leave outside.

She did not post it. She put it in the drawer with the other letters she had never posted, and went up the ninety-two steps to trim a wick.

Some arguments are won slowly, in small lights, over many dark years.`,
        }
      ]
    };
  }

  /* ── State ─────────────────────────────────────────────── */

  let state = {
    books: [],
    activeBookId: null,
    activeChapterId: null,
    page: 0
  };
  let pages = [];
  let toastTimer;

  const activeBook = () => state.books.find((b) => b.id === state.activeBookId) || state.books[0];
  const activeChapter = () => {
    const book = activeBook();
    return book ? book.chapters.find((c) => c.id === state.activeChapterId) || book.chapters[0] : null;
  };

  /* ── Persistence ───────────────────────────────────────── */

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.books) && parsed.books.length) {
          state.books = parsed.books;
          state.activeBookId = parsed.activeBookId;
          state.activeChapterId = parsed.activeChapterId;
          if (!activeBook()) state.activeBookId = state.books[0].id;
          if (!activeChapter()) state.activeChapterId = activeBook().chapters[0]?.id ?? null;
          return;
        }
      }
    } catch (err) {
      console.warn('Could not read saved work:', err);
    }
    const book = sampleBook();
    state.books = [book];
    state.activeBookId = book.id;
    state.activeChapterId = book.chapters[0].id;
  }

  function setSavedState(status) {
    const el = $('#savedIndicator');
    const text = $('#savedText');
    el.dataset.state = status;
    if (status === 'saving') text.textContent = 'Saving…';
    else if (status === 'error') text.textContent = 'Could not save';
    else text.textContent = 'All changes saved';
  }

  const persist = debounce(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        books: state.books,
        activeBookId: state.activeBookId,
        activeChapterId: state.activeChapterId
      }));
      setSavedState('saved');
    } catch (err) {
      console.error(err);
      setSavedState('error');
      toast('Storage is full — export a backup to be safe.');
    }
  }, 450);

  function markDirty() {
    setSavedState('saving');
    persist();
  }

  /* ── Toast ─────────────────────────────────────────────── */

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ── Rendering: sidebar ────────────────────────────────── */

  function renderLibrary() {
    const list = $('#bookList');
    list.innerHTML = '';

    state.books.forEach((book) => {
      const li = document.createElement('li');
      li.className = 'book-item';
      li.dataset.id = book.id;
      li.setAttribute('role', 'button');
      li.tabIndex = 0;
      if (book.id === activeBook().id) li.setAttribute('aria-current', 'true');

      const words = book.chapters.reduce((n, c) => n + countWords(c.body), 0);
      li.innerHTML = `
        <span class="book-spine" style="background: linear-gradient(155deg, ${book.accent}, ${shade(book.accent, -26)})"></span>
        <span class="book-meta">
          <strong>${escapeHtml(book.title || 'Untitled')}</strong>
          <span>${book.chapters.length} chapter${book.chapters.length === 1 ? '' : 's'} · ${formatNumber(words)} words</span>
        </span>`;
      list.appendChild(li);
    });

    $('#bookCount').textContent = `${state.books.length} book${state.books.length === 1 ? '' : 's'}`;
  }

  function renderChapters() {
    const book = activeBook();
    const list = $('#chapterList');
    list.innerHTML = '';

    book.chapters.forEach((chapter, index) => {
      const li = document.createElement('li');
      li.className = 'chapter-item';
      li.dataset.id = chapter.id;
      li.setAttribute('role', 'button');
      li.tabIndex = 0;
      if (chapter.id === state.activeChapterId) li.setAttribute('aria-current', 'true');
      li.innerHTML = `
        <span class="chapter-num">${index + 1}</span>
        <span class="chapter-name">${escapeHtml(chapter.title || 'Untitled chapter')}</span>
        <span class="chapter-actions">
          <button type="button" data-act="up" title="Move up" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" data-act="down" title="Move down" ${index === book.chapters.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" data-act="delete" title="Delete chapter">✕</button>
        </span>`;
      list.appendChild(li);
    });
  }

  function renderEditor() {
    const chapter = activeChapter();
    const editor = $('#chapterBody');
    const title = $('#chapterTitle');

    if (!chapter) {
      title.value = '';
      editor.value = '';
      title.disabled = true;
      editor.disabled = true;
      editor.placeholder = 'Create a chapter to start writing.';
      return;
    }

    title.disabled = false;
    editor.disabled = false;
    title.value = chapter.title;
    editor.value = chapter.body;
    editor.placeholder = 'Start writing…\n\nLeave a blank line between paragraphs. Use **bold**, *italic*, ## headings and > quotes.';

    const goal = activeBook().goal || 0;
    $('#goalInput').value = goal || '';
    updateCounts();
  }

  function updateCounts() {
    const chapter = activeChapter();
    const book = activeBook();
    const words = countWords(chapter?.body);
    const chars = (chapter?.body || '').length;
    const paragraphs = (chapter?.body || '').split(/\n\s*\n/).filter((p) => p.trim()).length;

    $('#chapterWords').textContent = `${formatNumber(words)} words`;
    $('#chapterRead').textContent = `${readingMinutes(words)} min read`;
    $('#charCount').textContent = `${formatNumber(chars)} characters`;
    $('#paragraphCount').textContent = `${paragraphs} paragraph${paragraphs === 1 ? '' : 's'}`;

    const goal = book.goal || 0;
    const progress = $('#goalProgress');
    if (goal > 0) {
      progress.textContent = `${formatNumber(words)} / ${formatNumber(goal)}`;
      progress.classList.toggle('done', words >= goal);
    } else {
      progress.textContent = 'words';
      progress.classList.remove('done');
    }

    const total = book.chapters.reduce((n, c) => n + countWords(c.body), 0);
    $('#totalWords').textContent = formatNumber(total);
    $('#totalPages').textContent = Math.max(1, Math.round(total / WORDS_PER_PAGE));
  }

  function formatNumber(n) {
    return new Intl.NumberFormat().format(n);
  }

  function shade(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const clamp = (v) => Math.max(0, Math.min(255, v));
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0xff) + amount);
    const b = clamp((num & 0xff) + amount);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  /* ── Rendering: reader pages ───────────────────────────── */

  function buildBlocks(book) {
    const blocks = [];
    book.chapters.forEach((chapter, index) => {
      blocks.push({
        type: 'chapter',
        text: chapter.title || `Chapter ${index + 1}`,
        kicker: `Chapter ${index + 1}`,
        words: 14
      });

      const raw = String(chapter.body || '').replace(/\r\n/g, '\n').trim();
      if (!raw) return;

      const paragraphs = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
      let firstParagraph = true;

      paragraphs.forEach((paragraph) => {
        const lines = paragraph.split('\n');

        if (/^(\*\s*){3,}$/.test(paragraph) || /^(-{3,})$/.test(paragraph) || /^(❋|✳)/.test(paragraph)) {
          blocks.push({ type: 'hr', text: '', words: 2 });
          return;
        }
        if (/^#{1,6}\s+/.test(paragraph)) {
          blocks.push({ type: 'heading', text: paragraph.replace(/^#{1,6}\s+/, ''), words: countWords(paragraph) + 7 });
          firstParagraph = false;
          return;
        }
        if (paragraph.startsWith('>')) {
          const quote = paragraph.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ');
          blocks.push({ type: 'quote', text: quote, words: countWords(quote) });
          firstParagraph = false;
          return;
        }

        blocks.push({
          type: 'p',
          text: lines.join(' '),
          words: countWords(paragraph),
          first: firstParagraph
        });
        firstParagraph = false;
      });
    });
    return blocks;
  }

  function paginate(book) {
    const blocks = buildBlocks(book);
    const result = [];
    let current = { blocks: [], words: 0 };

    blocks.forEach((block) => {
      const capacity = WORDS_PER_PAGE;
      const wouldOverflow = current.words + block.words > capacity;
      const headingTooLow = block.type === 'chapter' && current.words > capacity * 0.45;

      if (current.blocks.length && (wouldOverflow || headingTooLow)) {
        result.push(current);
        current = { blocks: [], words: 0 };
      }

      current.blocks.push(block);
      current.words += block.words;
    });

    if (current.blocks.length) result.push(current);

    // A closing page only when the last one is already fairly full.
    if (result.length && result[result.length - 1].words > WORDS_PER_PAGE * 0.45) {
      result.push({ blocks: [], words: 0, closing: true });
    }

    return result;
  }

  function renderBlock(block) {
    switch (block.type) {
      case 'chapter':
        return `<h2 class="chapter-opening"><span class="chapter-kicker">${escapeHtml(block.kicker)}</span>${inline(block.text)}</h2>`;
      case 'heading':
        return `<h3>${inline(block.text)}</h3>`;
      case 'quote':
        return `<blockquote>${inline(block.text)}</blockquote>`;
      case 'hr':
        return '<hr />';
      default:
        return `<p${block.first ? ' class="first"' : ''}>${inline(block.text)}</p>`;
    }
  }

  function renderReader() {
    const book = activeBook();
    pages = paginate(book);
    state.page = Math.max(0, Math.min(state.page, pages.length));

    const paper = $('#paper');
    const isTitle = state.page === 0;
    const page = pages[state.page - 1];

    if (isTitle) {
      paper.innerHTML = `
        <div class="title-page">
          <div class="tp-rule"></div>
          <h1>${escapeHtml(book.title || 'Untitled')}</h1>
          ${book.subtitle ? `<p class="tp-sub">${escapeHtml(book.subtitle)}</p>` : ''}
          ${book.description ? `<p class="tp-desc">${escapeHtml(book.description)}</p>` : ''}
          <div class="tp-author">${escapeHtml(book.author || 'Anonymous')}</div>
          ${book.genre ? `<div class="tp-genre">${escapeHtml(book.genre)}</div>` : ''}
        </div>
        <div class="paper-footer"><span>${escapeHtml(book.author || '')}</span><span>i</span></div>`;
      $('#pageLabel').textContent = `Title page · ${pages.length} p.`;
    } else if (page && page.closing) {
      paper.innerHTML = `
        <div class="end-page"><span>The End</span></div>
        <div class="paper-footer"><span>${escapeHtml(book.title)}</span><span>${state.page}</span></div>`;
      $('#pageLabel').textContent = `Page ${state.page} / ${pages.length}`;
    } else if (page) {
      paper.innerHTML = `
        <div class="paper-content">${page.blocks.map(renderBlock).join('')}</div>
        <div class="paper-footer"><span>${escapeHtml(book.title)}</span><span>${state.page}</span></div>`;
      $('#pageLabel').textContent = `Page ${state.page} / ${pages.length}`;
    } else {
      paper.innerHTML = `
        <div class="end-page"><span>This book is empty</span></div>
        <div class="paper-footer"><span>${escapeHtml(book.title)}</span><span>—</span></div>`;
      $('#pageLabel').textContent = 'Page 1 / 1';
    }

    $('#prevPage').disabled = state.page === 0;
    $('#nextPage').disabled = state.page >= pages.length;
    const words = book.chapters.reduce((n, c) => n + countWords(c.body), 0);
    $('#readerBookInfo').textContent = `${book.title || 'Untitled'} · ${formatNumber(words)} words · ~${Math.max(1, Math.round(words / WORDS_PER_PAGE))} pages`;
  }

  function renderAll() {
    renderLibrary();
    renderChapters();
    renderEditor();
    renderReader();
  }

  /* ── Editing interactions ──────────────────────────────── */

  const titleInput = $('#chapterTitle');
  const bodyInput = $('#chapterBody');

  titleInput.addEventListener('input', () => {
    const chapter = activeChapter();
    if (!chapter) return;
    chapter.title = titleInput.value;
    renderChapters();
    renderLibrary();
    renderReader();
    markDirty();
  });

  bodyInput.addEventListener('input', () => {
    const chapter = activeChapter();
    if (!chapter) return;
    chapter.body = bodyInput.value;
    updateCounts();
    renderReader();
    renderLibrary();
    markDirty();
  });

  // Keep the last page in view while typing.
  bodyInput.addEventListener('scroll', () => {
    if (state.page > 0 && state.page >= pages.length - 1) renderReader();
  }, { passive: true });

  function selectChapter(id, { focus = false } = {}) {
    state.activeChapterId = id;
    state.page = 0;
    renderChapters();
    renderEditor();
    renderReader();
    markDirty();
    if (focus) {
      $('#chapterTitle').focus();
      $('#chapterTitle').select();
    }
  }

  $('#chapterList').addEventListener('click', (event) => {
    const li = event.target.closest('.chapter-item');
    if (!li) return;
    const book = activeBook();
    const chapter = book.chapters.find((c) => c.id === li.dataset.id);
    if (!chapter) return;

    const action = event.target.closest('button')?.dataset.act;
    const index = book.chapters.indexOf(chapter);

    if (action === 'up' && index > 0) {
      [book.chapters[index - 1], book.chapters[index]] = [book.chapters[index], book.chapters[index - 1]];
      renderAll();
      markDirty();
      return;
    }
    if (action === 'down' && index < book.chapters.length - 1) {
      [book.chapters[index + 1], book.chapters[index]] = [book.chapters[index], book.chapters[index + 1]];
      renderAll();
      markDirty();
      return;
    }
    if (action === 'delete') {
      if (book.chapters.length === 1) {
        toast('A book needs at least one chapter.');
        return;
      }
      confirmAction(
        'Delete this chapter?',
        `“${chapter.title || 'Untitled chapter'}” will be permanently removed. This cannot be undone.`,
        'Delete chapter',
        () => {
          book.chapters = book.chapters.filter((c) => c.id !== chapter.id);
          state.activeChapterId = book.chapters[Math.min(index, book.chapters.length - 1)].id;
          state.page = 0;
          renderAll();
          markDirty();
          toast('Chapter deleted');
        }
      );
      return;
    }

    if (chapter.id !== state.activeChapterId) selectChapter(chapter.id);
  });

  $('#chapterList').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const li = event.target.closest('.chapter-item');
    if (!li || event.target.closest('button')) return;
    event.preventDefault();
    selectChapter(li.dataset.id);
  });

  $('#bookList').addEventListener('click', (event) => {
    const li = event.target.closest('.book-item');
    if (li) switchBook(li.dataset.id);
  });

  $('#bookList').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const li = event.target.closest('.book-item');
    if (!li) return;
    event.preventDefault();
    switchBook(li.dataset.id);
  });

  function switchBook(id) {
    if (id === state.activeBookId) return;
    const book = state.books.find((b) => b.id === id);
    if (!book) return;
    state.activeBookId = book.id;
    state.activeChapterId = book.chapters[0]?.id ?? null;
    state.page = 0;
    renderAll();
    markDirty();
  }

  $('#addChapterBtn').addEventListener('click', () => {
    const book = activeBook();
    const chapter = { id: uid(), title: `Chapter ${book.chapters.length + 1}`, body: '' };
    book.chapters.push(chapter);
    selectChapter(chapter.id, { focus: true });
    toast('Chapter added');
  });

  /* ── Formatting toolbar ────────────────────────────────── */

  function wrapSelection(before, after, placeholder) {
    const { selectionStart: start, selectionEnd: end, value } = bodyInput;
    const selected = value.slice(start, end) || placeholder;
    bodyInput.value = value.slice(0, start) + before + selected + after + value.slice(end);
    bodyInput.focus();
    bodyInput.setSelectionRange(start + before.length, start + before.length + selected.length);
    bodyInput.dispatchEvent(new Event('input'));
  }

  function prefixLines(prefix, placeholder) {
    const { selectionStart: start, selectionEnd: end, value } = bodyInput;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const block = value.slice(lineStart, end) || placeholder;
    const updated = block.split('\n').map((line) => prefix + line).join('\n');
    bodyInput.value = value.slice(0, lineStart) + updated + value.slice(end);
    bodyInput.focus();
    bodyInput.setSelectionRange(lineStart + prefix.length, lineStart + updated.length);
    bodyInput.dispatchEvent(new Event('input'));
  }

  function insertText(text) {
    const { selectionStart: start, selectionEnd: end, value } = bodyInput;
    bodyInput.value = value.slice(0, start) + text + value.slice(end);
    bodyInput.focus();
    const pos = start + text.length;
    bodyInput.setSelectionRange(pos, pos);
    bodyInput.dispatchEvent(new Event('input'));
  }

  function clearFormatting() {
    const { selectionStart: start, selectionEnd: end, value } = bodyInput;
    if (start === end) return;
    const cleaned = value.slice(start, end)
      .replace(/\*\*|__|\*|`/g, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^>\s?/gm, '');
    bodyInput.setRangeText(cleaned, start, end, 'select');
    bodyInput.dispatchEvent(new Event('input'));
  }

  document.querySelectorAll('.fmt').forEach((button) => {
    button.addEventListener('mousedown', (event) => event.preventDefault());
    button.addEventListener('click', () => {
      switch (button.dataset.fmt) {
        case 'bold': wrapSelection('**', '**', 'bold text'); break;
        case 'italic': wrapSelection('_', '_', 'italic text'); break;
        case 'h2': prefixLines('## ', 'Section heading'); break;
        case 'quote': prefixLines('> ', 'Quoted passage'); break;
        case 'break': insertText('\n\n* * *\n\n'); break;
        case 'clear': clearFormatting(); break;
      }
    });
  });

  /* ── Goal ──────────────────────────────────────────────── */

  $('#goalInput').addEventListener('input', (event) => {
    const value = Math.max(0, parseInt(event.target.value, 10) || 0);
    activeBook().goal = value;
    updateCounts();
    markDirty();
  });

  /* ── Page navigation ───────────────────────────────────── */

  function goToPage(page) {
    state.page = Math.max(0, Math.min(page, pages.length));
    renderReader();
  }

  $('#prevPage').addEventListener('click', () => goToPage(state.page - 1));
  $('#nextPage').addEventListener('click', () => goToPage(state.page + 1));
  $('#jumpToStart').addEventListener('click', () => goToPage(0));

  document.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea, dialog')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); goToPage(state.page + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); goToPage(state.page - 1); }
  });

  /* ── Book details dialog ───────────────────────────────── */

  const detailsDialog = $('#detailsDialog');

  function openDetails() {
    const book = activeBook();
    $('#metaTitle').value = book.title;
    $('#metaSubtitle').value = book.subtitle || '';
    $('#metaAuthor').value = book.author;
    $('#metaGenre').value = book.genre || '';
    $('#metaDescription').value = book.description || '';

    const swatches = $('#swatches');
    swatches.innerHTML = '';
    ACCENTS.forEach((accent) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'swatch';
      button.style.background = `linear-gradient(150deg, ${accent.value}, ${shade(accent.value, -28)})`;
      button.title = accent.name;
      button.dataset.value = accent.value;
      button.setAttribute('aria-pressed', String(book.accent === accent.value));
      swatches.appendChild(button);
    });

    detailsDialog.showModal();
  }

  $('#detailsBtn').addEventListener('click', openDetails);

  $('#swatches').addEventListener('click', (event) => {
    const swatch = event.target.closest('.swatch');
    if (!swatch) return;
    $('#swatches').querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-pressed', 'false'));
    swatch.setAttribute('aria-pressed', 'true');
  });

  $('#saveDetailsBtn').addEventListener('click', (event) => {
    event.preventDefault();
    const book = activeBook();
    book.title = $('#metaTitle').value.trim() || 'Untitled';
    book.subtitle = $('#metaSubtitle').value.trim();
    book.author = $('#metaAuthor').value.trim() || 'Anonymous';
    book.genre = $('#metaGenre').value.trim();
    book.description = $('#metaDescription').value.trim();
    const chosen = $('#swatches').querySelector('.swatch[aria-pressed="true"]');
    if (chosen) book.accent = chosen.dataset.value;
    detailsDialog.close();
    renderAll();
    markDirty();
    toast('Book details saved');
  });

  $('#deleteBookBtn').addEventListener('click', () => {
    const book = activeBook();
    detailsDialog.close();
    confirmAction(
      'Delete this book?',
      `“${book.title}” and its ${book.chapters.length} chapter${book.chapters.length === 1 ? '' : 's'} will be permanently removed.`,
      'Delete book',
      () => {
        state.books = state.books.filter((b) => b.id !== book.id);
        if (!state.books.length) {
          const fresh = sampleBook();
          fresh.title = 'Untitled book';
          fresh.subtitle = '';
          fresh.description = '';
          fresh.author = 'Anonymous';
          fresh.genre = '';
          fresh.chapters = [{ id: uid(), title: 'Chapter 1', body: '' }];
          state.books.push(fresh);
        }
        state.activeBookId = state.books[0].id;
        state.activeChapterId = state.books[0].chapters[0]?.id ?? null;
        state.page = 0;
        renderAll();
        markDirty();
        toast('Book deleted');
      }
    );
  });

  /* ── Confirm dialog ────────────────────────────────────── */

  const confirmDialog = $('#confirmDialog');
  let pendingConfirm = null;

  function confirmAction(title, text, okLabel, onConfirm) {
    $('#confirmTitle').textContent = title;
    $('#confirmText').textContent = text;
    $('#confirmOk').textContent = okLabel;
    pendingConfirm = onConfirm;
    confirmDialog.showModal();
  }

  confirmDialog.addEventListener('close', () => {
    if (confirmDialog.returnValue === 'ok' && pendingConfirm) pendingConfirm();
    pendingConfirm = null;
  });

  /* ── New book ──────────────────────────────────────────── */

  $('#newBookBtn').addEventListener('click', () => {
    const chapter = { id: uid(), title: 'Chapter 1', body: '' };
    const book = {
      id: uid(),
      title: 'Untitled book',
      subtitle: '',
      author: 'Anonymous',
      genre: '',
      description: '',
      accent: ACCENTS[Math.floor(Math.random() * ACCENTS.length)].value,
      goal: 0,
      chapters: [chapter]
    };
    state.books.push(book);
    state.activeBookId = book.id;
    state.activeChapterId = chapter.id;
    state.page = 0;
    renderAll();
    markDirty();
    openDetails();
    toast('New book created');
  });

  /* ── Export / import ───────────────────────────────────── */

  const exportBtn = $('#exportBtn');
  const exportMenu = $('#exportMenu');

  function toggleMenu(open) {
    const next = open ?? exportMenu.hidden;
    exportMenu.hidden = !next;
    exportBtn.setAttribute('aria-expanded', String(next));
  }

  exportBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu-wrap')) toggleMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') toggleMenu(false);
  });

  const slug = (s) => String(s || 'book').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'book';

  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function toMarkdown(book) {
    const lines = [`# ${book.title}`, ''];
    if (book.subtitle) lines.push(`*${book.subtitle}*`, '');
    lines.push(`**${book.author}**`, '');
    if (book.genre) lines.push(`_${book.genre}_`, '');
    if (book.description) lines.push(`> ${book.description}`, '');
    lines.push('---', '');
    book.chapters.forEach((chapter, index) => {
      lines.push(`## ${index + 1}. ${chapter.title || 'Untitled chapter'}`, '', (chapter.body || '').trim(), '');
    });
    return lines.join('\n');
  }

  function toPlainText(book) {
    return [
      book.title,
      book.subtitle ? book.subtitle : '',
      `by ${book.author}`,
      '',
      ...book.chapters.flatMap((chapter, index) => [
        `CHAPTER ${index + 1}: ${chapter.title || 'Untitled'}`,
        '',
        (chapter.body || '').replace(/[*_#>`]/g, ''),
        '',
        ''
      ])
    ].join('\n').replace(/\n{4,}/g, '\n\n\n');
  }

  function toStandaloneHtml(book) {
    const chapters = book.chapters.map((chapter, index) => `
      <section class="chapter">
        <p class="kicker">Chapter ${index + 1}</p>
        <h2>${escapeHtml(chapter.title || 'Untitled')}</h2>
        ${String(chapter.body || '')
          .split(/\n\s*\n/)
          .filter((p) => p.trim())
          .map((p, i) => {
            if (/^(\*\s*){3,}$/.test(p.trim())) return '<p class="break">* * *</p>';
            if (/^#{1,6}\s+/.test(p.trim())) return `<h3>${inline(p.trim().replace(/^#{1,6}\s+/, ''))}</h3>`;
            if (p.trim().startsWith('>')) return `<blockquote>${inline(p.trim().replace(/^>\s?/gm, ''))}</blockquote>`;
            return `<p${i === 0 ? ' class="first"' : ''}>${inline(p.trim()).replace(/\n/g, '<br />')}</p>`;
          })
          .join('\n')}
      </section>`).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(book.title)} — ${escapeHtml(book.author)}</title>
<style>
  @page { size: A5; margin: 18mm 16mm; }
  html { font-size: 16px; }
  body { max-width: 34rem; margin: 0 auto; padding: 3rem 1.5rem; color: #232019;
         font-family: "Iowan Old Style", Palatino, Georgia, serif; line-height: 1.66;
         text-align: justify; hyphens: auto; }
  .title-page { text-align: center; padding: 22vh 0 30vh; }
  .title-page h1 { font-size: 2.6rem; line-height: 1.14; margin: 0 0 .6rem; letter-spacing: -.02em; }
  .title-page .sub { font-style: italic; color: #6d6659; margin: 0 0 2.4rem; }
  .title-page .author { font-family: ui-sans-serif, system-ui, sans-serif; font-size: .78rem;
                        letter-spacing: .22em; text-transform: uppercase; }
  .chapter { margin-top: 3rem; }
  .chapter + .chapter { break-before: page; page-break-before: always; }
  .kicker { font-family: ui-sans-serif, system-ui, sans-serif; font-size: .68rem; letter-spacing: .2em;
            text-transform: uppercase; color: #6d6659; text-align: center; margin: 0 0 .4rem; }
  h2 { font-size: 1.75rem; text-align: center; margin: 0 0 1.6rem; line-height: 1.2; }
  h3 { font-size: 1.1rem; margin: 1.6rem 0 .6rem; }
  p { margin: 0 0 1em; text-indent: 1.4em; }
  p.first { text-indent: 0; }
  p.first::first-letter { float: left; font-size: 3.2em; line-height: .82; padding: .05em .1em 0 0; }
  .break { text-align: center; text-indent: 0; letter-spacing: .5em; color: #6d6659; }
  blockquote { margin: 1.2rem 0 1.2rem 1rem; padding-left: 1rem; border-left: 2px solid #d8cfba;
               font-style: italic; color: #514a3f; }
  .end { text-align: center; margin-top: 4rem; letter-spacing: .3em; font-size: .72rem;
         font-family: ui-sans-serif, system-ui, sans-serif; color: #6d6659; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="title-page">
    <h1>${escapeHtml(book.title)}</h1>
    ${book.subtitle ? `<p class="sub">${escapeHtml(book.subtitle)}</p>` : ''}
    <p class="author">${escapeHtml(book.author)}</p>
  </div>
  ${chapters}
  <p class="end">The End</p>
</body>
</html>`;
  }

  exportMenu.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-export]');
    if (!button) return;
    const kind = button.dataset.export;
    const book = activeBook();
    toggleMenu(false);

    if (kind === 'md') {
      download(`${slug(book.title)}.md`, toMarkdown(book), 'text/markdown;charset=utf-8');
      toast('Markdown manuscript exported');
    } else if (kind === 'txt') {
      download(`${slug(book.title)}.txt`, toPlainText(book), 'text/plain;charset=utf-8');
      toast('Plain text exported');
    } else if (kind === 'html') {
      download(`${slug(book.title)}.html`, toStandaloneHtml(book), 'text/html;charset=utf-8');
      toast('Print-ready HTML exported — open it and print to PDF');
    } else if (kind === 'json') {
      download(`book-publisher-backup-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify({ exportedAt: new Date().toISOString(), books: state.books }, null, 2),
        'application/json');
      toast('Backup exported');
    } else if (kind === 'import') {
      $('#importFile').click();
    }
  });

  $('#importFile').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();

      if (file.name.endsWith('.json')) {
        const data = JSON.parse(text);
        if (!Array.isArray(data.books)) throw new Error('Not a Book Publisher backup');
        state.books = data.books;
        state.activeBookId = state.books[0].id;
        state.activeChapterId = state.books[0].chapters[0]?.id ?? null;
        state.page = 0;
        renderAll();
        markDirty();
        toast(`Imported ${data.books.length} book(s)`);
        return;
      }

      const parts = text.split(/^#\s+/m);
      const hasHeading = parts.length > 1;
      const chunks = hasHeading ? parts.slice(1) : [text];
      const chapters = chunks.map((chunk, index) => {
        const [firstLine, ...rest] = chunk.split('\n');
        return hasHeading
          ? { id: uid(), title: firstLine.trim() || `Chapter ${index + 1}`, body: rest.join('\n').trim() }
          : { id: uid(), title: `Chapter ${index + 1}`, body: chunk.trim() };
      });

      const book = {
        id: uid(),
        title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Imported book',
        subtitle: '',
        author: 'Anonymous',
        genre: '',
        description: `Imported from ${file.name}`,
        accent: ACCENTS[Math.floor(Math.random() * ACCENTS.length)].value,
        goal: 0,
        chapters: chapters.length ? chapters : [{ id: uid(), title: 'Chapter 1', body: '' }]
      };
      state.books.push(book);
      state.activeBookId = book.id;
      state.activeChapterId = book.chapters[0].id;
      state.page = 0;
      renderAll();
      markDirty();
      toast(`Imported “${book.title}”`);
    } catch (err) {
      console.error(err);
      toast('That file could not be imported.');
    } finally {
      event.target.value = '';
    }
  });

  /* ── Theme ─────────────────────────────────────────────── */

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }

  $('#themeBtn').addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  /* ── Keyboard shortcuts ────────────────────────────────── */

  document.addEventListener('keydown', (event) => {
    const meta = event.metaKey || event.ctrlKey;
    if (!meta) return;
    const key = event.key.toLowerCase();

    if (key === 'b' && document.activeElement === bodyInput) {
      event.preventDefault();
      wrapSelection('**', '**', 'bold text');
    } else if (key === 'i' && document.activeElement === bodyInput) {
      event.preventDefault();
      wrapSelection('_', '_', 'italic text');
    } else if (key === 's') {
      event.preventDefault();
      persistNow();
      toast('Saved');
    }
  });

  function persistNow() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        books: state.books,
        activeBookId: state.activeBookId,
        activeChapterId: state.activeChapterId
      }));
      setSavedState('saved');
    } catch {
      setSavedState('error');
    }
  }

  window.addEventListener('beforeunload', persistNow);

  /* ── Boot ──────────────────────────────────────────────── */

  const prefersLight = typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-color-scheme: light)').matches;

  load();
  applyTheme(localStorage.getItem(THEME_KEY) || (prefersLight ? 'light' : 'dark'));
  renderAll();
  setSavedState('saved');
})();
