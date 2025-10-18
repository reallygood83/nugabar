/**
 * 이름 마스킹 유틸리티
 * 개인정보 보호를 위해 학생 이름의 가운데 글자를 '*'로 처리합니다.
 */

/**
 * 이름을 마스킹 처리합니다.
 * @param name - 원본 이름
 * @returns 마스킹된 이름
 * @example
 * maskName("김철수") // "김*수"
 * maskName("이영희") // "이*희"
 * maskName("박민") // "박*"
 * maskName("홍") // "홍" (1글자는 마스킹하지 않음)
 */
export function maskName(name: string): string {
  if (!name || name.length === 0) {
    return '';
  }

  // 1글자 이름은 마스킹하지 않음
  if (name.length === 1) {
    return name;
  }

  // 2글자 이름: 마지막 글자만 마스킹
  if (name.length === 2) {
    return name[0] + '*';
  }

  // 3글자 이상 이름: 가운데 글자 마스킹
  return name[0] + '*' + name.slice(2);
}

/**
 * 마스킹된 이름인지 확인합니다.
 * @param name - 확인할 이름
 * @returns 마스킹 여부
 */
export function isMaskedName(name: string): boolean {
  return name.includes('*');
}
