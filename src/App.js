import { Console } from "@woowacourse/mission-utils";

class App {
  async run() {
    Console.print("덧셈할 문자열을 입력해 주세요.");
    const input = await Console.readLineAsync();

    const result = this.#calculateBase(input);
    Console.print(`결과 : ${result}`);
  }

  // 빈 문자열과 기본 구분자(, :) 처리
  #calculateBase(input) {
    if (input === "") return 0;

    // 기본 구분자 , :
    const parts = input.split(/[,:]/);

    // 숫자로 변환
    const nums = parts.map((p) => Number(p));
    return nums.reduce((acc, n) => acc + n, 0);
  }
}

export default App;
