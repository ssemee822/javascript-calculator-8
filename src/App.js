import { Console } from "@woowacourse/mission-utils";

class App {
  async run() {
    Console.print("덧셈할 문자열을 입력해 주세요.");
    const input = await Console.readLineAsync();

    const result = this.#calculate(input);
    Console.print(`결과 : ${result}`);
  }

  // 커스텀 구분자(//X\n) + 기본 구분자(, :) 동시 처리
  #calculate(input) {
    if (input === "") return 0;

    const { custom, body } = this.#pickDelimiterHeader(input);
    const tokens = this.#split(body, custom);
    const numbers = tokens.map((t) => Number(t));
    return numbers.reduce((acc, n) => acc + n, 0);
  }

  // //X\n 형식 파싱
  #pickDelimiterHeader(input) {
    if (!input.startsWith("//")) return { custom: null, body: input };

    const nl = input.indexOf("\n");
    const custom = input.slice(2, nl);
    const body = input.slice(nl + 1);
    return { custom, body };
  }

  // 기본(, :) + 커스텀(있으면)으로 분리
  #split(str, custom) {
    const delims = [",", ":"];
    if (custom) delims.push(custom);

    const escaped = delims.map(this.#escapeForCharClass).join("");
    const re = new RegExp(`[${escaped}]`);
    return str.split(re);
  }

  // 정규식 문자클래스 이스케이프
  #escapeForCharClass(ch) {
    return ch.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
  }
}

export default App;
