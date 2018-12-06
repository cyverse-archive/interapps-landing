import hasValidSubdomain, { extractSubdomain } from './subdomain';

test('hasValidSubdomain should return true', () => {
  expect(hasValidSubdomain('afoo.cyverse.run:4343')).toBe(true)
});
