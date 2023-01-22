export const commentsArray = [
   {
      id: '1',
      parentId: null,
      createdAt: new Date('2015-12-01 23:50'),
      content: 'Lorem ipsum dolor sit amet #loremipsum, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.',
      attachments: [],
      pings: {},
      creatorUserId: 'simon_powell',
      creatorDisplayName: 'Simon Powell',
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=32',
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 3,
      upvotedByCurrentUser: true,
      isNew: false
   },
   {
      id: '2',
      parentId: null,
      createdAt: new Date('2016-01-02 00:32'),
      content: 'Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.',
      attachments: [],
      pings: {},
      creatorUserId: 'administrator',
      creatorDisplayName: 'Administrator',
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=49',
      createdByAdmin: true,
      createdByCurrentUser: false,
      upvoteCount: 2,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: '3',
      parentId: null,
      createdAt: new Date('2016-03-03 07:11'),
      content: '@hank_smith2 sed posuere interdum sem.\nQuisque ligula eros ullamcorper https://www.google.com/ quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget #velit.',
      attachments: [],
      pings: {
         'hank_smith2': 'Hank Smith',
      },
      creatorUserId: 'current-user',
      creatorDisplayName: 'You',
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=65',
      createdByAdmin: false,
      createdByCurrentUser: true,
      upvoteCount: 1,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: '4',
      parentId: '3',
      createdAt: new Date('2016-03-04 11:20'),
      modifiedAt: new Date('2016-03-04 11:29'),
      content: '',
      attachments: [
         {
            id: '1',
            file: 'http://www.w3schools.com/html/mov_bbb.mp4',
            mimeType: 'video/mp4',
         },
      ],
      creatorUserId: 'todd_brown',
      creatorDisplayName: 'Todd Brown',
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=33',
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 2,
      upvotedByCurrentUser: false,
      isNew: true
   },
   {
      id: '5',
      parentId: '4',
      createdAt: new Date('2016-03-05 09:11'),
      content: 'Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.',
      attachments: [],
      pings: {},
      creatorUserId: 'hank_smith2',
      creatorDisplayName: 'Hank Smith',
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=58',
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: true
   },
   {
      id: '6',
      parentId: '1',
      createdAt: new Date('2016-04-20 16:59'),
      content: 'Lorem ipsum dolor sit amet #loremipsum, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.',
      attachments: [],
      pings: {},
      creatorUserId: 'jack_hemsworth',
      creatorDisplayName: 'Jack Hemsworth',
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=50',
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
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=49',
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
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=65',
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
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=61',
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
            file: 'https://www.w3schools.com/images/w3schools_green.jpg',
            mimeType: 'image/jpeg',
         },
      ],
      pings: {},
      creatorUserId: 'current-user',
      creatorDisplayName: 'You',
      creatorProfilePictureURL: 'https://i.pravatar.cc/100?img=65',
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
      profilePictureURL: 'https://i.pravatar.cc/100?img=65'
   },
   {
      id: 'jack_hemsworth',//2,
      displayName: 'Jack Hemsworth',
      email: 'jack.hemsworth@example.com',
      profilePictureURL: 'https://i.pravatar.cc/100?img=50'
   },
   {
      id: 'hank_smith2',//3,
      displayName: 'Hank Smith',
      email: 'hank.smith@example.com',
      profilePictureURL: 'https://i.pravatar.cc/100?img=58'
   },
   {
      id: 'todd_brown',//4,
      displayName: 'Todd Brown',
      email: 'todd.brown@example.com',
      profilePictureURL: 'https://i.pravatar.cc/100?img=33'
   },
   {
      id: 'administrator',//5,
      email: 'administrator@example.com',
      profilePictureURL: 'https://i.pravatar.cc/100?img=49'
   },
   {
      id: 'simon_powell',//6,
      displayName: 'Simon Powell',
      email: 'simon.powell@example.com',
      profilePictureURL: 'https://i.pravatar.cc/100?img=32'
   },
   {
      id: 'bryan_connery',//7,
      displayName: 'Bryan Connery',
      email: 'bryan.connery@example.com',
      profilePictureURL: 'https://i.pravatar.cc/100?img=61'
   }
];
