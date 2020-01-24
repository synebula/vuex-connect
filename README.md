# vuex-connect

connect vuex like react-redux and class style

## Usage

Connect option declare as

```ts
export interface ConnectOptions {
  states?: Array<string | NamedProperty>;
  getters?: Array<string | NamedProperty>;
  actions?: Array<string | NamedProperty>;
  mutations?: Array<string | NamedProperty>;
}
```

You can use it like this:

```ts
// if use namespace of vuex, use like "{ home: ["name"] }",
// otherwise use string like "hello"
@connect({ states: ["hello", { home: ["name"] }] })
export default class Home extends Vue {
  // you can declare state like class fileds, or in data function
  state1 = "state1";
  state2 = 2;
  data() {
    return {
      state3: "state3"
    };
  }

  //declare computed
  get computed1() {
    return `computed ${state1}`;
  }

  //declare components
  components = {
    HelloWorld
  };
  props = ["someProps"]; //declare props
  mixins = [mixins]; //declare mixins

  //declare methods
  changeState1() {
    this.state1 = "stateChanged";
  }
  //...other methods

  //declare hooks
  created() {}
  //...other hooks
}
```
