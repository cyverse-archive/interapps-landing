import hasValidSubdomain, { extractSubdomain } from './subdomain';

test('hasValidSubdomain', () => {
  expect(hasValidSubdomain('afoo.cyverse.run:4343')).toBe(true);
  expect(hasValidSubdomain('foo.cyverse.run:4343')).toBe(false);
  expect(hasValidSubdomain('www.cyverse.run:4343')).toBe(false);
  expect(hasValidSubdomain('cyverse.run:4343')).toBe(false);
  expect(hasValidSubdomain('cyverse.run')).toBe(false);
  expect(hasValidSubdomain('argle.bargle')).toBe(false);
  expect(hasValidSubdomain('afoo.bar.cyverse.run:4343')).toBe(true);
});

test('extractSubdomain', () => {
  expect(extractSubdomain('http://afoo.cyverse.run:4343')).toBe('afoo');
  expect(extractSubdomain('http://afoo.bar.cyverse.run:4343')).toBe('afoo.bar');
  expect(() => {
    extractSubdomain('afoo.cyverse.run:4343');
  }).toThrowError();
  expect(() => {
    extractSubdomain('afoo.bar.cyverse.run:4343');
  }).toThrowError();
});
