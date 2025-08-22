import {
    SiGithub,
    SiGoogle,
    SiGoogletranslate,
    SiDouban
} from 'react-icons/si'

const NavigationCards = ({ hoveredCard, onCardHover, onCardClick }) => {
    const navigationCategories = [
        {
            title: "常用网站",
            items: [
                { name: "GitHub", url: "https://github.com/jucilang2022", icon: SiGithub, color: "#333" },
                { name: "Google", url: "https://www.google.com", icon: SiGoogle, color: "#4285F4" },
                { name: "翻译", url: "https://fanyi.baidu.com/mtpe-individual/multimodal?ext_channel=DuSearch", icon: SiGoogletranslate, color: "#4285F4" },
                { name: "豆瓣", url: "https://www.douban.com/people/230674291", icon: SiDouban, color: "#007722" }
            ]
        }
    ]

    return (
        <>
            {navigationCategories.map((category, categoryIndex) => (
                <section key={categoryIndex} className="category-section">
                    <h2 className="category-title">{category.title}</h2>
                    <div className="cards-grid">
                        {category.items.map((item, itemIndex) => {
                            const IconComponent = item.icon
                            return (
                                <div
                                    key={itemIndex}
                                    className={`nav-card ${hoveredCard === `${categoryIndex}-${itemIndex}` ? 'hovered' : ''}`}
                                    onClick={() => onCardClick(item.url)}
                                    onMouseEnter={() => onCardHover(`${categoryIndex}-${itemIndex}`)}
                                    onMouseLeave={() => onCardHover(null)}
                                >
                                    <div className="card-icon" style={{ backgroundColor: item.color }}>
                                        <IconComponent size={18} />
                                    </div>
                                    <span className="card-name">{item.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </section>
            ))}
        </>
    )
}

export default NavigationCards
