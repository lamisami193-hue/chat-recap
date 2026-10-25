const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/<script id="stats-src" type="text\/plain">([\s\S]*?)<\/script>/);
assert.ok(match, 'the embedded statistics engine must exist');

const context = {};
vm.runInNewContext(
  match[1] + '\nglobalThis.__testApi = { chatList, analyze };',
  context,
  { timeout: 3000 }
);
const { chatList, analyze } = context.__testApi;

function message(id, date, from = 'Alex', extra = {}) {
  return {
    id,
    type: 'message',
    date,
    from,
    from_id: from.toLowerCase(),
    text: 'hello world',
    ...extra
  };
}

test('counts messages with date_unixtime in the chat picker and analysis', () => {
  const data = {
    chats: {
      list: [{
        name: 'Unix timestamp chat',
        messages: [{
          id: 1,
          type: 'message',
          date_unixtime: '1760000000',
          from: 'Alex',
          from_id: 'user1',
          text: 'hello'
        }]
      }]
    }
  };

  const list = chatList(data);
  const result = analyze(data.chats.list, [0], 0);

  assert.equal(list[0].total, 1);
  assert.equal(list[0].years['2025'], 1);
  assert.equal(result.total, 1);
});

test('does not invent a longest-silence duration for a one-message chat', () => {
  const data = { chats: { list: [{ name: 'One message', messages: [message(1, '2026-01-01T10:00:00')] }] } };
  const result = analyze(data.chats.list, [0], 2026);

  assert.equal(result.silence.ms, 0);
  assert.equal(result.silence.from, 0);
  assert.equal(result.silence.to, 0);
});

test('counts video-only chats and includes videos in the media-card condition', () => {
  const data = {
    chats: {
      list: [{
        name: 'Video only',
        messages: [message(1, '2026-01-01T10:00:00', 'Alex', { text: '', media_type: 'video_file' })]
      }]
    }
  };
  const result = analyze(data.chats.list, [0], 2026);

  assert.equal(result.media.video, 1);
  assert.match(html, /md\.voice \+ md\.videoNote \+ md\.sticker \+ md\.photo \+ md\.gif \+ md\.video > 0/);
  assert.match(html, /tr\('videos'\), md\.video/);
});

test('measures silence between messages in one chat', () => {
  const data = {
    chats: {
      list: [{
        name: 'Two messages',
        messages: [
          message(1, '2026-01-01T10:00:00', 'Alex'),
          message(2, '2026-01-01T11:00:00', 'Sam')
        ]
      }]
    }
  };
  const result = analyze(data.chats.list, [0], 2026);

  assert.equal(result.total, 2);
  assert.equal(result.silence.ms, 60 * 60 * 1000);
});

test('rejects JSON that is not a supported Telegram export shape', () => {
  assert.throws(() => chatList({ unexpected: true }), { message: 'FORMAT' });
});

test('counts flags and keycaps as emoji, ignores plain (c) (R) (TM) symbols', () => {
  const text = '\u{1F1F2}\u{1F1E6} \u{1F1F2}\u{1F1E6} 1️⃣ © ® ™ ©️ \u{1F44D}\u{1F3FD}';
  const data = { chats: { list: [{ name: 'Emoji', messages: [message(1, '2026-01-01T10:00:00', 'Alex', { text })] }] } };
  const counts = Object.fromEntries(analyze(data.chats.list, [0], 2026).emojis.map((e) => [e[0], e[1]]));

  assert.equal(counts['\u{1F1F2}\u{1F1E6}'], 2);
  assert.equal(counts['1️⃣'], 1);
  assert.equal(counts['©️'], 1);
  assert.equal(counts['©'], undefined);
  assert.equal(counts['®'], undefined);
  assert.equal(counts['™'], undefined);
  assert.equal(counts['\u{1F44D}\u{1F3FD}'], 1);
});

test('the statistics engine is identical on all five tool pages', () => {
  const grab = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')
    .match(/<script id="stats-src" type="text\/plain">([\s\S]*?)<\/script>/)[1];
  for (const f of ['ar', 'es', 'fr', 'pt']) assert.equal(grab(f + '/index.html'), match[1], f);
});
