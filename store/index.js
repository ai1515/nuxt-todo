// vuexが定義しているmutationsが使えるようにする記述
import { vuexfireMutations } from "vuexfire";

export const mutations = {
  ...vuexfireMutations
};
