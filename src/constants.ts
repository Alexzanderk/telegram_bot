export const regex = {
  askPhone: /^((?=.*?(?:^|\P{L})тел(?:ефон[аы]?)?(?!\p{L}))|(?=.*?(?:^|\P{L})контакты?(?!\p{L})))((?=.*?(?:^|\P{L})ж[эе]ка?(?!\p{L}))|(?=.*?(?:^|\P{L})бух(галтера?)?(?!\p{L}))|(?=.*?(?:^|\P{L})охраны(?!\p{L})))[^\d\n]*$/gimu,
  // askPhone: /^(?=.*?(?<!\p{L})тел(?:ефон)?(?!\p{L}))(?=.*?(?<!\p{L})ж[эе]ка?(?!\p{L}))[^\d\n]*$/gimu,
};

export const TTL: number = 60 * 30; // sec * min
