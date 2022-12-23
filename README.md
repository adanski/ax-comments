# &lt;ax-comments&gt; element
&lt;ax-comments&gt; is a standalone web component with minimal set of dependencies (no jQuery!) for implementing an out-of-the-box commenting solution to any web application with an existing backend. It provides all the UI functionalities and ties them to callbacks that let you easily define what you want to do with the data. The library is highly customizable and very easy to integrate thanks to a wide variety of settings.

![Screenshot of ax-comments](screenshot.png?raw=true "Screenshot of ax-comments")

## Features

- Commenting
- Replying (nested comments)
- Editing comments
- Deleting comments
- Upvoting comments
- Uploading attachments
- Hashtags
- Pinging users
- Enabling/disabling functionalities
- Localization
- Time formatting
- Callbacks
- Fully responsive and mobile compatible
- Miscellaneous settings

## Demo
http://adanski.github.io/ax-comments/demo/

## Quick start
### Installation
```console
$ npm install --save ax-comments
```

### Usage
```javascript
import 'ax-comments/comments-element';

//...

const commentsElement = document.createElement('ax-comments');
commentsElement.options = {
    // ...
    getComments: (onSuccess, onError) => {
        const commentsArray = [{
            id: '1',
            content: "Lorem ipsum dolor sit amet",
            creatorUserId: "simon.powell",
            creatorDisplayName: "Simon Powell",
            // ...
            createdByAdmin: false,
            createdByCurrentUser: false,
            upvoteCount: 3,
            upvotedByCurrentUser: false,
            isNew: false
        }];
        onSuccess(commentsArray);
    },
    // ...
};

document.body.append(commentsElement);
```

See full example [here](https://github.com/adanski/ax-comments/blob/gh-pages/demo/demo.js).

If you are not using Font Awesome for icons, you should replace the icons with custom images by overriding following options when initializing the library:

```javascript
spinnerIconURL: '',
noCommentsIconURL: '',
closeIconURL: '',
upvoteIconURL: '',      // Only if upvoting is enabled
replyIconURL: '',       // Only if replying is enabled
uploadIconURL: '',      // Only if attachments are enabled
attachmentIconURL: '',  // Only if attachments are enabled
```

## Documentation
http://adanski.github.io/ax-comments

## Maintainers
- [adanski](https://github.com/adanski)

## Browser support
Basically every modern browser that supports native web components and shadow dom.

Includes Firefox, Edge, Chrome and probably Safari

## Special thanks
&lt;ax-comments&gt; probably wouldn't exist if it wasn't for the outstanding work of the authors of the following packages:
- [jquery-comments](https://github.com/Viima/jquery-comments)
- [textcomplete](https://github.com/yuku/textcomplete)
- [markdown-toolbar-element](https://github.com/github/markdown-toolbar-element)

## Copyright and license
Code and documentation copyright 2017-2021 [Viima Solutions Oy](https://www.viima.com/), 2022 [adanski](https://github.com/adanski).

Code released under [the MIT license](https://github.com/adanski/ax-comments/blob/master/LICENSE).
