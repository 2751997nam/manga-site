const formatDate = (dateTime) => {
    let matches = dateTime.match(/(\d{4})-(\d{2})-(\d{2})(\s+|T)(\d{1,2}):(\d{1,2}):.*/);
    if (matches && matches.length == 7) {
        let now = new Date();
        let date = new Date();
        date.setFullYear(matches[1]);
        date.setMonth(matches[2] - 1);
        date.setDate(matches[3]);
        date.setHours(matches[5]);
        date.setMinutes(matches[6]);
        let diffTime = (now.getTime() - date.getTime()) / 1000;
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

const getChapterName = (chapterName) => {
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

module.exports = {
    formatDate: formatDate,
    getChapterName: getChapterName
}