'use client';
import Hls from 'hls.js';
import React, { useEffect, useRef } from 'react';

const VideoPlayer = () => {
	const videoRef = useRef(null);
	const src =
		'https://yt-videos-s3bucket.s3.amazonaws.com/output/test_mp4_master.m3u8';

	useEffect(() => {
		const video = videoRef.current;

		if (Hls.isSupported()) {
			console.log('HLS is supported');
			console.log(src);
			const hls = new Hls();
			hls.attachMedia(video);
			hls.loadSource(src);
			hls.on(Hls.Events.MANIFEST_PARSED, function () {
				console.log('Playing Video');
				video.play();
			});
		} else {
			console.log('HLS is not supported');
		}
	}, [src]);

	return (
		<video
			ref={videoRef}
			controls
		/>
	);
};

export default VideoPlayer;
