import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import {browserName, isBrowser, isMobile} from 'react-device-detect';

const Tracking = (props) => {
    const router = useRouter();
    const targetType = props.targetType;
    const targetId = props.targetId;

    const tracking = useCallback(() => {
        fetch('/api/tracking-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({target_type: targetType, target_id: targetId})
        })
        let device = isBrowser ? 'browser' : (isMobile ? 'mobile' : 'unknown');
        let browser = browserName;
        let userAgent = navigator.userAgent;
        fetch('/api/tracking-click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({device: device, browser: browser, url: window.location.href, user_agent: userAgent})
        });
    }, [targetType, targetId])

    useEffect(() => {
        tracking();
    }, [router.asPath, router.query, tracking])

    return (
        <span className="js-tracking"></span>
    )
}

export default Tracking;