import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    //background-color: #ffffff;
    font-size: 12px;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    font-family: Nunito, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-kerning: normal;
    -webkit-text-size-adjust: 100%;
    @media (min-width: 600px) {
      overflow: hidden;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }

  html {
    --font-family: Jost, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  html[data-theme='light'] ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px lightgray;
  }

  html[data-theme='light'] ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 12px;
  }

  html[data-theme='dark'] ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 1px lightgray;
  }

  html[data-theme='dark'] ::-webkit-scrollbar-thumb {
    background: #11111180;
    border-radius: 12px;
  }
` as any;
