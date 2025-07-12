export default async function handler(req, res) {
  // 1) GET 요청만 허용
  if (req.method !== 'GET') {
    return res
      .status(405)
      .json({ error: 'GET 메서드만 허용됩니다.' });
  }

  // 2) 환경 변수에서 키 가져오기
  const apiKey        = process.env.OPENWEATHER_API_KEY;
  // 3) 조회할 도시(영문)와, 사용자에게 보여줄 지역명(한글)
  const cityQuery     = 'Dongtan';
  const displayRegion = '동탄';

  // 4) OpenWeatherMap API 호출 URL 구성
  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?q=${encodeURIComponent(cityQuery)},KR` +
    `&units=metric&lang=kr&appid=${apiKey}`;

  try {
    // 5) 외부 API 호출
    const apiRes = await fetch(url);
    if (!apiRes.ok) throw new Error(`API 에러 ${apiRes.status}`);
    const data = await apiRes.json();

    // 6) 필요한 데이터만 뽑아 한글 키로 재구성
    const result = {
      지역: displayRegion,
      날씨: data.weather[0].description,
      기온: `${data.main.temp}°C`,
      체감기온: `${data.main.feels_like}°C`,
      습도: `${data.main.humidity}%`,
      풍속: `${data.wind.speed}m/s`
    };

    // 7) 200 OK와 함께 JSON 응답
    return res.status(200).json(result);

  } catch (err) {
    console.error(err);
    // 8) 오류 시 500과 사용자용 에러 메시지
    return res
      .status(500)
      .json({ error: '날씨 정보를 가져오는 데 실패했습니다.' });
  }
}
