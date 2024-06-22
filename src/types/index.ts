export type Article = {
  title: string;
  description: string;
  url: string;
};

export type RootStackParamList = {
  Articles: undefined;
  WebView: {title: string; url: string};
};
