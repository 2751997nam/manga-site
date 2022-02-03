import Config from '@/config';

export const formatDate = (dateTime) => {
    let matches = dateTime.match(/(\d{4})-(\d{2})-(\d{2})(\s+|T)(\d{1,2}):(\d{1,2}):.*/);
    if (matches && matches.length == 7) {
        let now = new Date();
        let date = new Date();
        date.setFullYear(matches[1]);
        date.setMonth(matches[2] - 1);
        date.setDate(matches[3]);
        date.setHours(matches[5]);
        date.setMinutes(matches[6]);
        let diffTime = (now.getTime() - date.getTime()) / 1000 - 7 * 3600;
        let diffWeek = Math.floor(diffTime / 7 / 86400); 
        let diffDay = Math.floor(diffTime / 86400);
        let diffHour = Math.floor(diffTime / 3600);
        let diffMinute = Math.floor(diffTime / 60);
        if (diffWeek > 0) {
            if (diffWeek < 3) {
                return `${diffWeek} ${diffWeek > 1 ? 'weeks' : 'week'} ago`;    
            }
        }
        else if (diffDay > 0) {
            return `${diffDay} ${diffDay > 1 ? 'days' : 'day'} ago`;
        } else if (diffHour > 0) {
            return `${diffHour} ${diffHour > 1 ? 'hours' : 'hour'} ago`;
        } else if (diffMinute > 0) {
            return `${diffMinute} ${diffMinute > 1 ? 'minutes' : 'minute'} ago`;
        } else {
            return 'Just now';
        }
    }
    let outputFormat = "$3-$2-$1";
    return dateTime.replace(/(\d{4})-(\d{2})-(\d{2})(\s+|T)(\d{1,2}):(\d{1,2}):.*/, outputFormat);
}

export const addZero = (num) => {
    return num > 9 ? num : `0${num}`;
}

export const currentDate = (getDate = true) => {
    let now = new Date();

    return now.getFullYear() + '-' + (addZero(now.getMonth() + 1)) + (getDate ? '-' + addZero(now.getDate()) : '');
}

export const getChapterName = (chapterName) => {
    let index = chapterName.indexOf('chap');
    if (index < 0) {
        index = chapterName.indexOf('Chap');
    }
    if (index < 0) {
        index = chapterName.indexOf('ch');
    }
    if (index > 0) {
        return chapterName.substr(index).trim();
    }
    
    return chapterName;
}

export const getImageSrc = (url) => {
    if (url && url.indexOf('http') === 0) {
        return url;
    }

    return (Config.cdn_url ? Config.cdn_url : '') + url;
}

export const getMangaRoute = (manga) => {
    return `/manga/${manga.slug}`;
}

export const getChapterRoute = (manga, chapter) => {
    return `/manga/${manga.slug}/${chapter.slug}`;
}
