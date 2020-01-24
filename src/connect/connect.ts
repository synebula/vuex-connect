import Vue from "vue";
import { ConnectOptions, VueClass } from "./connect.d";
import { resolveProperties, resolveOption } from "./resolvers";

/**
 * 关联vuex中属性到vue对象
 * @param options Connect选项
 */
export default (options?: ConnectOptions) => {
  return (Component: VueClass<Vue>) => {
    let instance = new Component();
    const { data, components, computed, methods, hooks, props, mixins } = resolveProperties(instance);
    const { states, getters, actions, mutations } = resolveOption(options || {});
    let vueOptions: any = {
      name: Component.name,
      props,
      mixins,
      components,
      data() {
        return {
          ...data
        };
      },
      computed: {
        ...computed,
        ...states,
        ...getters
      },
      methods: {
        ...methods,
        ...actions,
        ...mutations
      },
      ...hooks
    };
    return vueOptions;
  };
};
