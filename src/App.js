import { Console } from "@woowacourse/mission-utils";

class App {
  async run() {
    // 테스트에서 run() 결과를 검증하므로, 내부에서 에러를 catch하지 않습니다.
    Console.print("덧셈할 문자열을 입력해 주세요.");
    const input = await Console.readLineAsync();

    const result = this.#calculate(input);
    Console.print(`결과 : ${result}`);
    return result;
  }

  #calculate(input) {
    if (input === "") return 0;

    const { delimiter, expression } = this.#parseHeader(input);
    const tokens = expression.split(delimiter);

    const numbers = tokens.map((token) => {
      if (token === "")
        throw new Error("[ERROR] 비어 있는 값이 포함되었습니다.");
      if (!/^\d+$/.test(token))
        throw new Error("[ERROR] 숫자만 입력할 수 있습니다.");
      const n = Number(token);
      if (n < 0) throw new Error("[ERROR] 음수는 허용되지 않습니다.");
      return n;
    });

    return numbers.reduce((a, b) => a + b, 0);
  }

  #parseHeader(input) {
    // 기본 구분자: , 또는 :
    const defaultDelimiters = /,|:/;

    // 커스텀 구분자: //X\n...
    if (input.startsWith("//")) {
      // 한 글자 구분자만 허용
      const m = input.match(/^\/\/(.)\n([\s\S]*)$/);
      if (!m)
        throw new Error("[ERROR] 커스텀 구분자 형식이 올바르지 않습니다.");

      const [, custom, expression] = m;
      const escaped = custom.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      // 기본 구분자(, :)도 항상 함께 허용
      const combined = new RegExp(`[${escaped},:]`);
      return { delimiter: combined, expression };
    }

    return { delimiter: defaultDelimiters, expression: input };
  }
}

export default App;
