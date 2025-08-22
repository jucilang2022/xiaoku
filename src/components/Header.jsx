import { SiBaidu } from 'react-icons/si'

const Header = ({ searchQuery, onSearchChange, onSearch }) => {
    return (
        <header className="header">
            <form className="search-form" onSubmit={onSearch}>
                <div className="search-input-wrapper">
                    <SiBaidu className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="搜索任何内容..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="search-input"
                    />
                </div>
                <button type="submit" className="search-button">
                    搜索
                </button>
            </form>
        </header>
    )
}

export default Header
