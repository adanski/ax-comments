export const commentsArray = [
   {
      id: '1',
      parentId: null,
      createdAt: parseDate('2015-12-01', '23:50'),
      content: 'Lorem ipsum dolor sit amet #loremipsum, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.',
      attachments: [],
      pings: {},
      creatorUserId: 'simon_powell',
      creatorDisplayName: 'Simon Powell',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 3,
      upvotedByCurrentUser: true,
      isNew: false
   },
   {
      id: '2',
      parentId: null,
      createdAt: parseDate('2016-01-02', '00:32'),
      content: 'Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.',
      attachments: [],
      pings: {},
      creatorUserId: 'administrator',
      creatorDisplayName: 'Administrator',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: true,
      createdByCurrentUser: false,
      upvoteCount: 2,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: '3',
      parentId: null,
      createdAt: parseDate('2016-03-03', '07:11'),
      content: '@hank_smith2 sed posuere interdum sem.\nQuisque ligula eros ullamcorper https://www.google.com/ quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget #velit.',
      attachments: [],
      pings: {
         'hank_smith2': 'Hank Smith',
      },
      creatorUserId: 'current-user',
      creatorDisplayName: 'You',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: false,
      createdByCurrentUser: true,
      upvoteCount: 2,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: '4',
      parentId: '3',
      createdAt: parseDate('2016-03-04', '11:20'),
      modifiedAt: parseDate('2016-03-04', '11:29'),
      content: '',
      attachments: [
         {
            id: '1',
            'file': 'http://www.w3schools.com/html/mov_bbb.mp4',
            'mime_type': 'video/mp4',
         },
      ],
      creatorUserId: 'todd_brown',
      creatorDisplayName: 'Todd Brown',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: true
   },
   {
      id: '5',
      parentId: '4',
      createdAt: parseDate('2016-03-05', '09:11'),
      content: 'Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.',
      attachments: [],
      pings: {},
      creatorUserId: 'hank_smith2',
      creatorDisplayName: 'Hank Smith',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: true
   },
   {
      id: '6',
      parentId: '1',
      createdAt: parseDate('2016-04-20', '16:59'),
      content: 'Lorem ipsum dolor sit amet #loremipsum, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.',
      attachments: [],
      pings: {},
      creatorUserId: 'jack_hemsworth',
      creatorDisplayName: 'Jack Hemsworth',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 1,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: '7',
      parentId: '1',
      createdAt: new Date(new Date().getTime() - 27 * 24 * 60 * 60 * 1000),
      content: 'Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.',
      attachments: [],
      pings: {},
      creatorUserId: 'administrator',
      creatorDisplayName: 'Administrator',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: true,
      createdByCurrentUser: false,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: '8',
      parentId: '6',
      createdAt: new Date(new Date().getTime() - 12 * 60 * 60 * 1000),
      content: 'Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.',
      attachments: [],
      pings: {},
      creatorUserId: 'current-user',
      creatorDisplayName: 'You',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: false,
      createdByCurrentUser: true,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: '9',
      parentId: '8',
      createdAt: new Date(new Date().getTime() - 33 * 60 * 1000),
      content: 'Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.',
      attachments: [],
      pings: {},
      creatorUserId: 'bryan_connery',
      creatorDisplayName: 'Bryan Connery',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: '10',
      parentId: '9',
      createdAt: (() => {
         return new Date(new Date().getTime() - 51 * 1000)
      })(),
      content: 'Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.',
      attachments: [
         {
            id: '2',
            'file': 'https://www.w3schools.com/images/w3schools_green.jpg',
            'mime_type': 'image/jpeg',
         },
      ],
      pings: {},
      creatorUserId: 'current-user',
      creatorDisplayName: 'You',
      creatorProfilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png',
      createdByAdmin: false,
      createdByCurrentUser: true,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: false
   }
];

export const usersArray = [
   {
      id: 'current-user',//1,
      displayName: 'Current User',
      email: 'current.user@example.com',
      profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png'
   },
   {
      id: 'jack_hemsworth',//2,
      displayName: 'Jack Hemsworth',
      email: 'jack.hemsworth@example.com',
      profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png'
   },
   {
      id: 'hank_smith2',//3,
      displayName: 'Hank Smith',
      email: 'hank.smith@example.com',
      profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png'
   },
   {
      id: 'todd_brown',//4,
      displayName: 'Todd Brown',
      email: 'todd.brown@example.com',
      profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png'
   },
   {
      id: 'administrator',//5,
      email: 'administrator@example.com',
      profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png'
   },
   {
      id: 'simon_powell',//6,
      displayName: 'Simon Powell',
      email: 'simon.powell@example.com',
      profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png'
   },
   {
      id: 'bryan_connery',//7,
      displayName: 'Bryan Connery',
      email: 'bryan.connery@example.com',
      profilePictureURL: 'https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png'
   }
];

function parseDate(date, time) {
   const splitDate = date.split('-');
   if (!time) {
      return new Date(splitDate[0], splitDate[1], splitDate[2]);
   } else {
      const splitTime = time.split(':');
      return new Date(splitDate[0], splitDate[1], splitDate[2], splitTime[0], splitTime[1]);
   }
}
