const epochs = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

const getDuration = (timeAgoInSeconds) => {
  if (!timeAgoInSeconds) {
    return {
      interval: 0,
      epoch: "second",
    };
  }
  for (let [name, seconds] of epochs) {
    const interval = Math.floor(timeAgoInSeconds / seconds);
    if (interval >= 1) {
      return {
        interval: interval,
        epoch: name,
      };
    }
  }
};

export const timeAgo = (date) => {
  const timeAgoInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
  const { interval, epoch } = getDuration(timeAgoInSeconds);
  const suffix = interval === 1 ? "" : "s";
  return `${interval} ${epoch}${suffix} ago`;
};

export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const fetcher = (url) => fetch(url).then((res) => res.json());

export const sortNotifications = (notifications) => {
  if (notifications.length === 0) return;
  let messageArr = [];
  let commentArr = [];
  let followArr = [];

  notifications.forEach((notification) => {
    if (notification.type === "message") {
      let obj = messageArr.find(
        (item) => item.sent_user_id === notification.sent_user_id
      );
      if (!obj) messageArr.push(notification);
    }

    if (notification.type === "comment") {
      let obj = commentArr.find(
        (item) =>
          item.sent_user_id === notification.sent_user_id &&
          item.link === notification.link
      );
      if (!obj) commentArr.push(notification);
    }

    if (notification.type === "follow") {
      let obj = followArr.find(
        (item) => item.sent_user_id === notification.sent_user_id
      );
      if (!obj) followArr.push(notification);
    }
  });
  return [...messageArr, ...commentArr, ...followArr];
};

export const shortenText = (text) => {
  if (text.length > 30) {
    return text.slice(0, 30).concat("...");
  }
  return text;
};
