export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ error: 'GET 메서드만 허용됩니다.' });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const cityQuery     = 'Dongtan';
  const displayRegion = '동탄';
  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?q=${encodeURIComponent(cityQuery)},KR` +
    `&units=metric&lang=kr&appid=${apiKey}`;

  try {
    const apiRes = await fetch(url);
    if (!apiRes.ok) throw new Error(`API 에러 ${apiRes.status}`);
    const data = await apiRes.json();

    const result = {
      지역: displayRegion,
      날씨: data.weather[0].description,
      기온: `${data.main.temp}°C`,
      체감기온: `${data.main.feels_like}°C`,
      습도: `${data.main.humidity}%`,
      풍속: `${data.wind.speed}m/s`
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: '날씨 정보를 가져오는 데 실패했습니다.' });
  }
}
