// public/voteHandler.js

export async function submitVote(proposalId, vote) {
    // Placeholder: simulate a vote API POST
    console.log(`Submitting vote for Proposal ${proposalId}: ${vote}`);

    // Simulated feedback
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, message: 'Vote submitted!' });
        }, 500);
    });
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