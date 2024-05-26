import { create } from 'zustand';

export const useVideoStore = create(set => ({
	searchedVideos: [],
	updateSearchedVideos: videos => set({ searchedVideos: videos })
}));
