function getInitials(name) {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

function getAvatarColor(name) {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

function UserTable({ data }) {
    return (
        <div className="table-card">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <div className="user-cell">
                                    <div
                                        className="avatar"
                                        style={{ backgroundColor: getAvatarColor(user.name) }}
                                    >
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="user-info">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-id">ID #{user.id}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <a href={`mailto:${user.email}`} className="email-link">
                                    {user.email}
                                </a>
                            </td>
                            <td>
                                <span className="username-badge">@{user.username}</span>
                            </td>
                            <td className="phone-cell">{user.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;