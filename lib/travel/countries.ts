export type Country = {
  code: string; name: string; flag: string; region: string;
  entry: string; preparation: string; official: { label: string; url: string }[];
};
export const countries: Country[] = [
  {code:"JPN",name:"일본",flag:"🇯🇵",region:"아시아",entry:"한국 여권의 단기 관광 입국 조건과 체류 가능 기간을 출발 전 확인하세요.",preparation:"Visit Japan Web, 세관 신고, 면세 규정을 확인하세요.",official:[{label:"Visit Japan Web",url:"https://www.vjw.digital.go.jp/"}]},
  {code:"USA",name:"미국",flag:"🇺🇸",region:"북미",entry:"ESTA 또는 적절한 비자 등 본인에게 해당하는 입국 자격을 확인하세요.",preparation:"ESTA 승인과 최종 입국 허가는 다릅니다.",official:[{label:"미국 CBP ESTA",url:"https://esta.cbp.dhs.gov/"}]},
  {code:"FRA",name:"프랑스",flag:"🇫🇷",region:"유럽",entry:"솅겐 단기 체류 규정과 최신 입국 절차를 확인하세요.",preparation:"EES 및 ETIAS 시행 상태와 교통 운행 정보를 확인하세요.",official:[{label:"EU 여행 정보",url:"https://travel-europe.europa.eu/"}]},
  {code:"THA",name:"태국",flag:"🇹🇭",region:"아시아",entry:"무비자 체류기간과 입국 요건은 변경될 수 있어 최신 공지가 필요합니다.",preparation:"전자 입국 신고와 여권 조건을 확인하세요.",official:[{label:"태국 전자 입국 신고",url:"https://tdac.immigration.go.th/"}]},
  {code:"AUS",name:"호주",flag:"🇦🇺",region:"오세아니아",entry:"한국 여권 여행자는 여행 목적에 맞는 사전 입국 허가를 확인하세요.",preparation:"ETA 신청과 엄격한 검역·세관 신고를 확인하세요.",official:[{label:"호주 내무부",url:"https://immi.homeaffairs.gov.au/"}]},
  {code:"TWN",name:"대만",flag:"🇹🇼",region:"아시아",entry:"단기 체류 입국 조건과 여권 유효기간을 확인하세요.",preparation:"대만 온라인 입국 신고서 제출 요건을 확인하세요.",official:[{label:"대만 입국 신고",url:"https://twac.immigration.gov.tw/"}]},
  {code:"SGP",name:"싱가포르",flag:"🇸🇬",region:"아시아",entry:"한국 여권 기준 단기 방문 조건을 확인하세요.",preparation:"SG Arrival Card 제출 시점과 요건을 확인하세요.",official:[{label:"싱가포르 ICA",url:"https://www.ica.gov.sg/"}]},
  {code:"GBR",name:"영국",flag:"🇬🇧",region:"유럽",entry:"방문 목적에 따른 ETA 또는 비자 필요 여부를 확인하세요.",preparation:"공식 GOV.UK 페이지에서 ETA 요건을 확인하세요.",official:[{label:"영국 ETA",url:"https://www.gov.uk/guidance/apply-for-an-electronic-travel-authorisation-eta"}]},
  {code:"NZL",name:"뉴질랜드",flag:"🇳🇿",region:"오세아니아",entry:"NZeTA 등 방문 허가 조건을 확인하세요.",preparation:"IVL, 입국 신고, 생물보안 규정을 확인하세요.",official:[{label:"뉴질랜드 이민성",url:"https://www.immigration.govt.nz/"}]},
  {code:"CAN",name:"캐나다",flag:"🇨🇦",region:"북미",entry:"입국 수단과 여행자 신분에 따른 eTA 또는 비자 요건을 확인하세요.",preparation:"항공편 입국과 육로 입국의 요건이 다를 수 있습니다.",official:[{label:"캐나다 이민부",url:"https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html"}]}
];
