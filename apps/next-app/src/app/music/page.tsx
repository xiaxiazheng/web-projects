'use client';
import Header from "../../components/common/header";
import MusicPlayerWrapper from "../../components/music-player-wrapper";

export default function Music() {
    return (
        <>
            <Header title="music" />
            <main>
                <MusicPlayerWrapper />
            </main>
        </>
    );
}
