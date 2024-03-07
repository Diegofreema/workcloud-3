const { STREAM_API_KEY, STEAM_SECRET_KEY } = process.env;

export function GET(request: Request) {
  console.log(STREAM_API_KEY, STEAM_SECRET_KEY);
  return Response.json({ hello: 'world' });
}
