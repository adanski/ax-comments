export const commentsArray = [
   {
      id: 1,
      parentId: null,
      createdAt: parseDate("2015-12-01"),
      modifiedAt: parseDate("2015-12-01"),
      content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
      attachments: [],
      pings: {},
      creatorUserId: "simon.powell",
      creatorDisplayName: "Simon Powell",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 3,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: 2,
      parentId: null,
      createdAt: parseDate("2016-01-02"),
      modifiedAt: parseDate("2016-01-02"),
      content: "Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
      attachments: [],
      pings: {},
      creatorUserId: "administrator",
      creatorDisplayName: "Administrator",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: true,
      createdByCurrentUser: false,
      upvoteCount: 2,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: 3,
      parentId: null,
      createdAt: parseDate("2016-03-03"),
      modifiedAt: parseDate("2016-03-03"),
      content: "@hank.smith sed posuere interdum sem.\nQuisque ligula eros ullamcorper https://www.google.com/ quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget #velit.",
      attachments: [],
      pings: {
         'hank.smith': 'Hank Smith',
      },
      creatorUserId: "current.user",
      creatorDisplayName: "You",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: false,
      createdByCurrentUser: true,
      upvoteCount: 2,
      upvotedByCurrentUser: true,
      isNew: false
   },
   {
      id: 4,
      parentId: 3,
      createdAt: parseDate("2016-03-04"),
      modifiedAt: parseDate("2016-03-04"),
      content: "",
      attachments: [
         {
            id: 1,
            "file": "http://www.w3schools.com/html/mov_bbb.mp4",
            "mime_type": "video/mp4",
         },
      ],
      creatorUserId: "todd.brown",
      creatorDisplayName: "Todd Brown",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: true
   },
   {
      id: 5,
      parentId: 4,
      createdAt: parseDate("2016-03-05"),
      modifiedAt: parseDate("2016-03-05"),
      content: "Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.",
      attachments: [],
      pings: {},
      creatorUserId: "hank.smith",
      creatorDisplayName: "Hank Smith",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: true
   },
   {
      id: 6,
      parentId: 1,
      createdAt: parseDate("2016-04-20"),
      modifiedAt: parseDate("2016-04-20"),
      content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
      attachments: [],
      pings: {},
      creatorUserId: "jack.hemsworth",
      creatorDisplayName: "Jack Hemsworth",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 1,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: 7,
      parentId: 1,
      createdAt: parseDate("2016-04-23"),
      modifiedAt: parseDate("2016-04-23"),
      content: "Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.",
      attachments: [],
      pings: {},
      creatorUserId: "administrator",
      creatorDisplayName: "Administrator",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: true,
      createdByCurrentUser: false,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: 8,
      parentId: 6,
      createdAt: parseDate("2016-04-25"),
      modifiedAt: parseDate("2016-04-25"),
      content: "Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.",
      attachments: [],
      pings: {},
      creatorUserId: "current.user",
      creatorDisplayName: "You",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: false,
      createdByCurrentUser: true,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: 9,
      parentId: 8,
      createdAt: parseDate("2016-04-28"),
      modifiedAt: parseDate("2016-04-28"),
      content: "Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.",
      attachments: [],
      pings: {},
      creatorUserId: "bryan.connery",
      creatorDisplayName: "Bryan Connery",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: false,
      createdByCurrentUser: false,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: false
   },
   {
      id: 10,
      parentId: 9,
      createdAt: parseDate("2022-12-09"),
      modifiedAt: parseDate("2022-12-09"),
      content: "Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit.",
      attachments: [
         {
            id: 2,
            "file": "https://www.w3schools.com/images/w3schools_green.jpg",
            "mime_type": "image/jpeg",
         },
      ],
      pings: {},
      creatorUserId: "current.user",
      creatorDisplayName: "You",
      creatorProfilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png",
      createdByAdmin: false,
      createdByCurrentUser: true,
      upvoteCount: 0,
      upvotedByCurrentUser: false,
      isNew: false
   }
];

export const usersArray = [
   {
      id: "current.user",//1,
      displayName: "Current User",
      email: "current.user@example.com",
      profilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: "jack.hemsworth",//2,
      displayName: "Jack Hemsworth",
      email: "jack.hemsworth@example.com",
      profilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: "hank.smith",//3,
      displayName: "Hank Smith",
      email: "hank.smith@example.com",
      profilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: "todd.brown",//4,
      displayName: "Todd Brown",
      email: "todd.brown@example.com",
      profilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: "administrator",//5,
      email: "administrator@example.com",
      profilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: "simon.powell",//6,
      displayName: "Simon Powell",
      email: "simon.powell@example.com",
      profilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   },
   {
      id: "bryan.connery",//7,
      displayName: "Bryan Connery",
      email: "bryan.connery@example.com",
      profilePictureURL: "https://viima-app.s3.amazonaws.com/media/public/defaults/user-icon.png"
   }
];

function parseDate(date) {
   const split = date.split('-');
   return new Date(split[0], split[1], split[2]);
}
