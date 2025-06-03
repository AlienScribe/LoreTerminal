// public/voteHandler.js

export async function submitVote(proposalId, vote) {
    try {
        const res = await fetch("/api/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ proposalId, vote })
        });
        if (!res.ok) throw new Error("Vote failed");
        return await res.json();
    } catch (err) {
        console.error("Vote submission error:", err);
        return { success: false, message: "Vote failed" };
    }
}

export function renderVoteControls(proposalId) {
    const container = document.createElement('div');
    container.className = 'vote-controls';

    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'YES';
    yesBtn.onclick = async () => {
        const res = await submitVote(proposalId, 'yes');
        alert(res.message);
    };

    const noBtn = document.createElement('button');
    noBtn.textContent = 'NO';
    noBtn.onclick = async () => {
        const res = await submitVote(proposalId, 'no');
        alert(res.message);
    };

    container.appendChild(yesBtn);
    container.appendChild(noBtn);
    return container;
}