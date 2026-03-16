import re

with open('d:/Code/FunghaDimsum/css/style.css', 'r', encoding='utf-8') as f:
    content = f.read()

desktop_css = """/* ---------- Header Base (Chinese Theme) ---------- */
#header.chinese-theme-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    background: transparent;
    padding: 10px 0;
    animation: slideInDown 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
}

#header.chinese-theme-header::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(5, 0, 0, 0.95) 0%, rgba(10, 0, 0, 0.6) 60%, transparent 100%);
    z-index: -1;
    transition: all 0.5s ease;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    border-bottom: 1px solid rgba(227, 176, 75, 0.1);
}

#header.chinese-theme-header.scrolled {
    padding: 2px 0;
}

#header.chinese-theme-header.scrolled::before {
    background: linear-gradient(135deg, rgba(8, 2, 2, 0.98), rgba(20, 5, 5, 0.95)),
        url('../images/bg_header.jpeg') center/cover no-repeat;
    opacity: 1;
    border-bottom: 2px solid var(--color-logo-gold);
    animation: borderGlow 3s ease-in-out infinite;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
}

/* Red / Gold decorative bottom */
.header-pattern-bottom {
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, #C42129, #FFD700, #C42129, transparent);
    opacity: 0;
    z-index: 2;
    transition: opacity 0.5s ease;
}

#header.chinese-theme-header.scrolled .header-pattern-bottom {
    opacity: 1;
    animation: shimmerText 4s linear infinite;
}

/* ---------- Header Inner ---------- */
.header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100px;
    padding: 0 48px;
    width: 100%;
    position: relative;
    transition: height 0.4s ease;
}

#header.chinese-theme-header.scrolled .header-inner {
    height: 72px;
}

/* ---------- Logo ---------- */
.logo a {
    display: flex;
    align-items: center;
    gap: 16px;
    text-decoration: none;
    position: relative;
}

.logo img {
    height: 72px;
    width: auto;
    animation: logoFloat 5s ease-in-out infinite;
    cursor: pointer;
    transition: height 0.4s ease;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
}

#header.chinese-theme-header.scrolled .logo img {
    height: 52px;
}

.logo-title-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0px;
}

.logo-text {
    font-family: 'Cinzel Decorative', cursive;
    font-size: 1.8rem;
    font-weight: 900;
    background: linear-gradient(90deg, #FFD700, #FFF8DC, #E3B04B, #FFD700);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmerText 4s linear infinite;
    text-transform: uppercase;
    letter-spacing: 2px;
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.9));
    transition: font-size 0.4s ease;
    line-height: 1.2;
}

#header.chinese-theme-header.scrolled .logo-text {
    font-size: 1.4rem;
}

.logo-subtitle {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #E3B04B;
    text-transform: uppercase;
    letter-spacing: 2px;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));
    transition: opacity 0.4s ease, height 0.4s ease;
    height: 20px;
    overflow: hidden;
}

.logo-sub-cn {
    font-family: 'Noto Serif SC', serif;
    font-weight: 700;
    font-size: 0.9rem;
    color: #FFD700;
}

.logo-sub-dot {
    font-size: 0.8rem;
    color: #C42129;
}

.logo-sub-vn {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    opacity: 0.9;
}

#header.chinese-theme-header.scrolled .logo-subtitle {
    opacity: 0;
    height: 0;
}

/* Beautiful Red Seal */
.logo-seal {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #E62020, #9A0D0D);
    color: #FFF8DC;
    border: 1px solid rgba(255, 215, 0, 0.4);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'ZCOOL XiaoWei', serif;
    font-size: 20px;
    margin-left: 10px;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.6), inset 0 0 5px rgba(0,0,0,0.3);
    transform: rotate(4deg);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.logo-seal::after {
    content: "";
    position: absolute;
    inset: 2px;
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 2px;
}

.logo a:hover .logo-seal {
    transform: rotate(-4deg) scale(1.1);
    box-shadow: 0 0 15px rgba(196, 33, 41, 0.8);
}

/* ---------- Navbar ---------- */
#navbar {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

#navbar .nav-links {
    display: flex;
    gap: 40px;
    align-items: center;
}

#navbar .nav-links a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-decoration: none;
    padding: 10px 20px;
    position: relative;
    transition: transform 0.3s ease;
}

.nav-char {
    font-family: 'Noto Serif SC', serif;
    font-size: 1.3rem;
    color: rgba(227, 176, 75, 0.4);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    line-height: 1;
}

.nav-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: #F8F3EA;
    transition: all 0.3s ease;
    text-shadow: 0 1px 4px rgba(0,0,0,0.8);
}

#navbar .nav-links a::before {
    content: "「";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #C42129;
    font-family: 'Noto Serif SC', serif;
    font-size: 1.6rem;
    opacity: 0;
    transition: all 0.3s ease;
}

#navbar .nav-links a::after {
    content: "」";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #C42129;
    font-family: 'Noto Serif SC', serif;
    font-size: 1.6rem;
    opacity: 0;
    transition: all 0.3s ease;
}

#navbar .nav-links a:hover,
#navbar .nav-links a.active {
    transform: translateY(-3px);
}

#navbar .nav-links a:hover .nav-char,
#navbar .nav-links a.active .nav-char {
    color: #C42129;
    transform: translateY(-2px) scale(1.1);
    text-shadow: 0 0 10px rgba(196, 33, 41, 0.5);
}

#navbar .nav-links a:hover .nav-text,
#navbar .nav-links a.active .nav-text {
    color: #FFD700;
    text-shadow: 0 0 12px rgba(255, 215, 0, 0.7);
}

#navbar .nav-links a:hover::before,
#navbar .nav-links a.active::before {
    opacity: 1;
    left: -8px;
}

#navbar .nav-links a:hover::after,
#navbar .nav-links a.active::after {
    opacity: 1;
    right: -8px;
}
"""

mobile_css = """    #navbar .nav-links a {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 16px;
        width: 100%;
        padding: 20px 0;
        border-bottom: 1px solid rgba(227, 176, 75, 0.12);
        opacity: 0;
        transform: translateX(24px);
        transition: opacity 0.38s ease, transform 0.38s ease,
            background-color 0.2s ease, border-color 0.2s ease;
        text-decoration: none;
    }

    #navbar .nav-links a .nav-char {
        font-size: 1.5rem;
        color: rgba(196, 33, 41, 0.8);
        line-height: 1;
    }

    #navbar .nav-links a .nav-text {
        font-size: 1.1rem;
        letter-spacing: 4px;
        color: rgba(245, 226, 133, 0.85);
        font-weight: 700;
        text-transform: uppercase;
    }

    #navbar .nav-links li:first-child a {
        border-top: 1px solid rgba(227, 176, 75, 0.12);
    }

    #navbar .nav-links a:hover,
    #navbar .nav-links a.active {
        background-color: rgba(227, 176, 75, 0.08);
        border-color: rgba(227, 176, 75, 0.3);
        transform: translateX(0) !important;
    }
    
    #navbar .nav-links a:hover .nav-char,
    #navbar .nav-links a.active .nav-char {
        color: #FFD700;
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
    }

    #navbar .nav-links a:hover .nav-text,
    #navbar .nav-links a.active .nav-text {
        color: #FFD700;
    }

    #navbar .nav-links a::before,
    #navbar .nav-links a::after {
        display: none;
    }"""

pattern1 = re.compile(r'/\* ---------- Header Base ---------- \*/.*?#navbar \.nav-links a\.active::after \{\s*width: 100%;\s*\}\s*', re.DOTALL)
content = pattern1.sub(desktop_css + '\n', content)

pattern2 = re.compile(r'#navbar \.nav-links a \{.*?#navbar \.nav-links a::after \{\s*display: none;\s*\}', re.DOTALL)
content = pattern2.sub(mobile_css, content)

# Fix #header.scrolled in mobile
content = content.replace('#header.scrolled .header-inner', '#header.chinese-theme-header.scrolled .header-inner')
content = content.replace('#header.scrolled .logo img', '#header.chinese-theme-header.scrolled .logo img')
# Handle any remaining #header.scrolled occurrences that were not updated
content = content.replace('#header.scrolled {', '#header.chinese-theme-header.scrolled {')
content = content.replace('#header.scrolled::before', '#header.chinese-theme-header.scrolled::before')
content = content.replace('#header.scrolled::after', '#header.chinese-theme-header.scrolled::after')

with open('d:/Code/FunghaDimsum/css/style.css', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done CSS replaced!")
