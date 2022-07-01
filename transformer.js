const { typeConfig } = require('./transformer.config');

const { readFile, writeFile } = require('fs').promises;
(async () => {
  let tokens = await readFile('./data/output.json');
  const obj = JSON.parse(tokens.toString());
  const arr = Object.entries(obj);
  const result = {};
  // option: 사용할 type을 설정해주는 배열
  typeConfig.forEach((v) => {
    result[v] = '';
  });
  arr.forEach((v, i) => {
    // v[1].type => 타입
    // v[1].value => 값
    // v[0] => 변수명 => 가공 필요 (띄어쓰기 및 대문자)
    // 타입별로 객체의 속성을 지정해서
    // --변수명: 값; 요 형태로 정렬
    const type = v[1].type;
    const value = v[1].value;
    let name = v[0].toLowerCase().replaceAll(' ', '-');

    // result[type] === undefined
    //   ? (result[type] = '')
    if (result[type] !== undefined) result[type] += `--${name}:${value};`;
  }); // => type을 기준으로 필터링 한 객체형태로 리턴

  console.log(result);

  writeFile('./data/tranformed.json', JSON.stringify(result));
})();
