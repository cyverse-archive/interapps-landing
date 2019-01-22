import hasValidSubdomain, { extractSubdomain } from './subdomain';

beforeAll(()=>{
  process.env.APP_EXPOSER_HEADER = "app-exposer";
  process.env.INGRESS = "http://localhost:8082";
  process.env.DB = "postgres://user:password@host:port/db";
  process.env.VICE_DOMAIN = "https://cyverse.run:4343";
});

describe('hasValidSubdomain', () => {
  test('valid subdomain', () => {
    expect(hasValidSubdomain('https://afoo.cyverse.run:4343')).toBe(true);
  });
  test('does not start with a', () => {
    expect(hasValidSubdomain('foo.cyverse.run:4343')).toBe(false);
  });
  test('starts with www', () => {
    expect(hasValidSubdomain('www.cyverse.run:4343')).toBe(false);
  });
  test('no subdomain', () => {
    expect(hasValidSubdomain('cyverse.run:4343')).toBe(false);
  });
  test('no port', () => {
    expect(hasValidSubdomain('cyverse.run')).toBe(false);
  });
  test('nonsense that sort of looks like a host', () => {
    expect(hasValidSubdomain('argle.bargle')).toBe(false);
  });
  test('subdomain with a . in it', () => {
    expect(hasValidSubdomain('afoo.bar.cyverse.run:4343')).toBe(true);
  });
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
