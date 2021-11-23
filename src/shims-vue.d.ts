declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.jpeg' {
  const path: string;

  export default path;
}

declare module '*.png' {
  const path: string;

  export default path;
}

declare module '*.mp3' {
  const path: string;

  export default path;
}
