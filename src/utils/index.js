const epochs = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1]
];

const getDuration = (timeAgoInSeconds) => {
    if (timeAgoInSeconds === 0) {
        return {
            interval: 0,
            epoch: 'second',
        }
    }
    for (let [name, seconds] of epochs) {
        const interval = Math.floor(timeAgoInSeconds / seconds);
        if (interval >= 1) {
            return {
                interval: interval,
                epoch: name
            };
        }
    }
};

export const timeAgo = (date) => {
    const timeAgoInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
    const {interval, epoch} = getDuration(timeAgoInSeconds);
    const suffix = interval === 1 ? '' : 's';
    return `${interval} ${epoch}${suffix} ago`;
};


export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };
  
  
export const fetcher = (url) => fetch(url).then((res) => res.json());