# HNClient – A desktop client for Hacker News

This app lets you comfortably read Hacker News without having to open an endless amount of tabs anymore. You can choose articles to view from a sidebar and can optionally read articles and their comments next to each other on a split screen.
The app works on Mac, Linux and Windows.

([Downloads](https://github.com/florian/HNClient/releases) | [Website](https://florian.github.io/HNClient/))

## Features
- You can easily choose articles to view and switch to the comments, no more
  endless new tabs for HN
- Optional split screen: View articles and their comments next to each other
- Easily navigate the App with Vim like keyboard shortcuts
- Comments are foldable
- Things that are overlooked by most HN apps weren't forgotten, stuff like
  displaying HN polls, rendering PDFs or not showing a website for Ask HN posts
- Automatically loads new articles if you scrolled down far enough
- It's Open Source, you can change it however you like! :)

![](https://i.imgur.com/L3eyTqZ.png)
![](https://i.imgur.com/4e36YVo.png)

## Keyboard shortcuts

| action | shortcut |
|:--|:--|
| next story |  <kbd>j</kbd> |
| previous story |  <kbd>k</kbd> |
| cycle between display modes (links, comments, both) |  <kbd>l</kbd> |
| next comment |  <kbd>n</kbd> |
| previous comment |  <kbd>m</kbd> |
| fold / expand the current comment |  <kbd>enter</kbd> |
| reload stories list |  <kbd>r</kbd> |
| display a list of all shortcuts |  <kbd>h</kbd> |


## Tech overview
- Electron
- ES6, React and Redux
- Stylus and [css-modules](https://github.com/css-modules/css-modules)
- Webpack
- JavaScript [Standard](https://github.com/feross/standard) style
- Mostly follows the conventions of the [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)
- Uses the nice [node-hnapi](https://github.com/cheeaun/node-hnapi) which wraps HN's official API. HN's API itself is sadly not very usable so far, e.g. to fetch all 200 comments of a thread we'd need to do 200 requests, which would greatly degrade user experience. Thanks to node-hnapi this app does not need to do that.


- - -

## A word on packaging

Currently the Windows and Linux builds don't use an installer program to bundle everything into a single file. I guess that would be the optimal packaging but I don't have any experience programming for Windows / Linux. So I'm hoping someone might contribute if it's important to them :)

## Contributing

Please follow the JavaScript [Standard](https://github.com/feross/standard) style!

### Developing

```sh
# Run both next to each other. The app will then automatically hot reload changed modules
$ npm run hot-server
$ npm run start-hot
```

### Packaging
```sh
$ npm run build
$ npm run package # to package for the current platform
$ npm run package-all # for all platforms
```

### Ideas

While I implemented all of the features I definitely wanted, there's also a [list of feature ideas](https://github.com/florian/HNClient/blob/master/ideas.md).
