import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import Auth from './pages/Auth';
import Room from './pages/Room';
import YoutubeHome from './pages/YoutubeHome';
import UploadForm from './upload/page';

export default function Home() {
	return (
		<div>
			<YoutubeHome />
		</div>
	);
}