import Vue from "vue";

/**
 * 命名空间属性
 */
export class NamedProperty {
  /**
   * key为命名空间名称，值为命名空间下需要映射的值
   */
  [key: string]: string[];
}

/**
 * vuex连接选项。
 * 各项为数组，数组值为string | NamedProperty可选
 */
export interface ConnectOptions {
  states?: Array<string | NamedProperty>;
  getters?: Array<string | NamedProperty>;
  actions?: Array<string | NamedProperty>;
  mutations?: Array<string | NamedProperty>;
}

export type VueClass<V> = { new (...args: any[]): V & Vue } & typeof Vue;
