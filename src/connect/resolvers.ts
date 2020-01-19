import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { ConnectOptions, NamedProperty } from "./connect.d";

/*************************************************************************
 * 解析参数值
 */

/**
 * 解析ConnectOption到vuex的 { states, getters, actions, mutations } map方法
 * @param options 需要解析的Connect选项
 */
export function resolveOption(options: ConnectOptions) {
  const { states, getters, actions, mutations } = options;

  let mappedStates = states
    ? mapProperies(states, (args: string[], namespace?: string) =>
        namespace ? mapState(namespace, args) : mapState(args)
      )
    : {};
  let mappedGetters = getters
    ? mapProperies(getters, (args: string[], namespace?: string) =>
        namespace ? mapGetters(namespace, args) : mapGetters(args)
      )
    : {};
  let mappedActions = actions
    ? mapProperies(actions, (args: string[], namespace?: string) =>
        namespace ? mapActions(namespace, args) : mapActions(args)
      )
    : {};
  let mappedMutations = mutations
    ? mapProperies(mutations, (args: string[], namespace?: string) =>
        namespace ? mapMutations(namespace, args) : mapMutations(args)
      )
    : {};

  return { states: mappedStates, getters: mappedGetters, actions: mappedActions, mutations: mappedMutations };
}

/**
 *  解析ConnectOption的具体解析逻辑
 * @param option
 * @param mapFun
 */
function mapProperies(option: Array<string | NamedProperty>, mapFun: Function) {
  let mappedProperties = {};

  if (option) {
    let strings: string[] = [];
    option.forEach(item => {
      if (typeof item === "string") {
        strings.push(item);
      }
      if (typeof item === "object") {
        for (const key in item) {
          if (item[key] instanceof Array) {
            mappedProperties = {
              ...mappedProperties,
              ...mapFun(item[key], key)
            };
          }
        }
      }
    });

    if (strings.length > 0) {
      mappedProperties = {
        ...mappedProperties,
        ...mapFun(strings)
      };
    }
  }
  return mappedProperties;
}

/*************************************************************************
 * 解析属性值
 */

/**
 * 采集组件的属性到vue option中
 * @param component 需要采集属性信息的组件对象
 */
export function resolveProperties(component: Record<string, any>) {
  let data: Record<string, any> = {};
  let computed: Record<string, any> = {};
  let methods: Record<string, any> = {};
  let hooks: Record<string, any> = {};
  let components: Record<string, any> = component.components || {};
  let props: Array<any> = component.props || [];
  let mixins: Array<any> = component.mixins || [];

  let proto: any = Reflect.getPrototypeOf(component);
  let fields = Reflect.ownKeys(component);
  let functions = Reflect.ownKeys(proto);

  for (const key of functions) {
    if (key == "constructor") continue; //忽略构造方法
    if (isHooks(key.toString())) {
      if (key == "data") {
        let datas = proto.data();
        data = datas;
      } else {
        hooks[key.toString()] = proto[key];
      }
    } else {
      let func = Reflect.getOwnPropertyDescriptor(proto, key);
      if (isComputed(func!)) {
        computed[key.toString()] = func!.get;
      } else {
        methods[key.toString()] = proto[key];
      }
    }
  }

  fields.forEach(field => isData(field) && (data[field.toString()] = component[field.toString()]));

  hooks.created = component.created ? component.created : function() {};

  return {
    data,
    components,
    computed,
    methods,
    hooks,
    props,
    mixins
  };
}

/**
 * 判断一个方法是否是vue hook方法
 * @param funcName 方法名称
 */
function isHooks(funcName: string) {
  const internelMethods = [
    "data",
    "beforeCreate",
    "created",
    "beforeMount",
    "mounted",
    "beforeDestroy",
    "destroyed",
    "beforeUpdate",
    "updated",
    "activated",
    "deactivated",
    "render",
    "errorCaptured", // 2.5
    "serverPrefetch" // 2.6
  ];
  return internelMethods.indexOf(funcName) > -1;
}

/**
 * 判断类的属性是否是Data值
 * @param field 类的属性
 */
function isData(field: string | number | symbol) {
  const internelFields = [
    "$options",
    "$parent",
    "$root",
    "$children",
    "$refs",
    "$vnode",
    "$slots",
    "$scopedSlots",
    "$createElement",
    "$attrs",
    "$listeners",
    "_uid",
    "_isVue",
    "_renderProxy",
    "_self",
    "_watcher",
    "_inactive",
    "_directInactive",
    "_isMounted",
    "_isDestroyed",
    "_isBeingDestroyed",
    "_events",
    "_hasHookEvent",
    "_vnode",
    "_staticTrees",
    "_c",
    "_watchers",
    "_data",
    "props",
    "components",
    "mixins"
  ];
  return internelFields.indexOf(field.toString()) == -1;
}

/**
 * 判断类的一个方法是否是Computed方法（是否是get方法）
 * @param func 方法描述符
 */
function isComputed(func: PropertyDescriptor) {
  let result = false;
  for (const key in func) {
    if (key == "get" && typeof func[key] == "function") result = true;
  }
  return result;
}
