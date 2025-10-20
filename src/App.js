import { Console } from "@woowacourse/mission-utils";

class App {
  async run() {
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

    if (!input.startsWith("//")) {
      return { delimiter: defaultDelimiters, expression: input };
    }

    // 헤더 구분 위치 탐색: \n, \r, 또는 리터럴 "\\n"
    const idxLF = input.indexOf("\n"); // LF
    const idxCR = input.indexOf("\r"); // CR
    const idxLIT = input.indexOf("\\n"); // literal "\n"

    const candidates = [idxLF, idxCR, idxLIT].filter((i) => i >= 0);
    if (candidates.length === 0) {
      throw new Error("[ERROR] 커스텀 구분자 형식이 올바르지 않습니다.");
    }
    const nl = Math.min(...candidates);

    // 커스텀 구분자 추출 (CR 제거)
    const rawCustom = input.slice(2, nl);
    const custom = rawCustom.replace(/\r/g, "");
    if (custom.length !== 1) {
      throw new Error("[ERROR] 커스텀 구분자는 한 글자여야 합니다.");
    }

    // 표현식 시작 위치: 실제 개행(\n 또는 \r)이면 +1, 리터럴 "\\n"이면 +2
    const isLiteral = nl === idxLIT;
    const exprStart = nl + (isLiteral ? 2 : 1);
    const expression = input.slice(exprStart);

    const escaped = custom.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    // 기본 구분자(, :)도 항상 함께 허용
    const combined = new RegExp(`[${escaped},:]`);
    return { delimiter: combined, expression };
  }
}

export default App;
