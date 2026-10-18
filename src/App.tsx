import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, Check,
  ChevronLeft, ChevronRight, Clock3, ExternalLink, Menu, Moon, Search,
  Send, Share2, Sparkles, Sun, TrendingUp, X,
} from 'lucide-react';
import { categories, demoStories, type Story } from './data';

type Theme = 'dark' | 'light';
type SharedProps = {
  stories: Story[];
  bookmarks: string[];
  onBookmark: (id: string) => void;
  live: boolean;
  loading: boolean;
};

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.24, ease: 'easeOut' as const },
};

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — Signal`;
  }, [title]);
}

function Header({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchText.trim();
    if (query) {
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Signal home">
          <span className="brand-mark"><span /></span>
          <span>signal<span className="brand-period">.</span></span>
        </Link>
        <nav className={`primary-nav${mobileOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/latest">Latest</NavLink>
          <NavLink to="/trending">Trending</NavLink>
          <NavLink to="/categories">Topics</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="header-tools">
          <form className={`header-search${searchOpen ? ' is-open' : ''}`} role="search" onSubmit={search} onClick={() => { if (window.matchMedia('(max-width: 780px)').matches && !searchOpen) setSearchOpen(true); }} onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false); }}>
            <Search size={16} aria-hidden="true" />
            <input ref={searchInput} aria-label="Search stories" placeholder="Search stories" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
            <kbd>/</kbd>
          </form>
          <button className="icon-button theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link className="header-bookmarks" to="/bookmarks" aria-label="Saved stories"><Bookmark size={16} /><span>Saved</span></Link>
          <button className="icon-button menu-toggle" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function SampleNotice({ live }: { live: boolean }) {
  return (
    <div className={`edition-notice${live ? ' live-notice' : ''}`} role="status">
      <span className="notice-dot" />
      <span>{live ? 'LIVE SOURCES CONNECTED' : 'SAMPLE EDITION'}</span>
      <span className="notice-divider">/</span>
      <span>{live ? 'Stories link to their original publishers' : 'AI-generated sample stories · not live reporting'}</span>
      {!live && <Sparkles size={13} aria-hidden="true" />}
    </div>
  );
}

function ImageFrame({ story, className = '' }: { story: Story; className?: string }) {
  return (
    <div className={`image-frame ${className}`}>
      <img src={story.image} alt="" loading="lazy" />
      <span className="image-shade" />
      {story.live && <span className="live-image-tag"><span className="notice-dot" /> Live source</span>}
    </div>
  );
}

function BookmarkButton({ saved, onClick }: { saved: boolean; onClick: () => void }) {
  return (
    <button className={`bookmark-button${saved ? ' is-saved' : ''}`} type="button" onClick={onClick} aria-label={saved ? 'Remove bookmark' : 'Save story'} aria-pressed={saved} title={saved ? 'Remove bookmark' : 'Save story'}>
      <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}

function StoryCard({ story, saved, onBookmark, featured = false }: { story: Story; saved: boolean; onBookmark: () => void; featured?: boolean }) {
  return (
    <motion.article className={`story-card${featured ? ' story-card-featured' : ''}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link className="story-image-link" to={`/article/${story.slug}`} aria-label={`Read ${story.title}`}>
        <ImageFrame story={story} />
      </Link>
      <div className="story-card-body">
        <div className="story-card-topline">
          <Link className="category-label" to={`/category/${story.category}`}>{story.categoryLabel}</Link>
          <BookmarkButton saved={saved} onClick={onBookmark} />
        </div>
        <h3><Link to={`/article/${story.slug}`}>{story.title}</Link></h3>
        <p className="story-excerpt">{story.excerpt}</p>
        <div className="story-meta"><span>{story.author}</span><span className="meta-separator" /><span>{story.live ? formatDate(story.publishedAt) : 'Sample story'}</span><span className="meta-spacer" /><Clock3 size={13} /><span>{story.readTime}</span></div>
      </div>
    </motion.article>
  );
}

function StoryGrid({ stories, bookmarks, onBookmark, loading = false, emptyTitle = 'Nothing here yet', emptyText = 'Try another topic or check back later.', action }: {
  stories: Story[]; bookmarks: string[]; onBookmark: (id: string) => void; loading?: boolean; emptyTitle?: string; emptyText?: string; action?: ReactNode;
}) {
  if (loading) {
    return <div className="story-grid" aria-label="Loading stories">{[0, 1, 2, 3].map((item) => <div className="skeleton-card" key={item}><div className="skeleton-image" /><div className="skeleton-line short" /><div className="skeleton-line" /><div className="skeleton-line medium" /></div>)}</div>;
  }
  if (stories.length === 0) return <EmptyState title={emptyTitle} text={emptyText} action={action} />;
  return <div className="story-grid">{stories.map((story) => <StoryCard key={story.id} story={story} saved={bookmarks.includes(story.id)} onBookmark={() => onBookmark(story.id)} />)}</div>;
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-symbol"><Search size={20} /></span><h2>{title}</h2><p>{text}</p>{action}</div>;
}

function SectionHeading({ eyebrow, title, detail, link }: { eyebrow: string; title: string; detail?: string; link?: { label: string; to: string } }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{link && <Link className="text-link" to={link.to}>{link.label}<ArrowUpRight size={15} /></Link>}</div>;
}

function HomePage({ stories, bookmarks, onBookmark, live }: SharedProps) {
  usePageTitle('The future, in focus');
  const lead = stories[0];
  const sideStories = stories.slice(1, 4);
  const latest = stories.slice(1, 5);
  if (!lead) return <EmptyState title="No stories available" text="The edition could not be loaded. Please refresh to try again." />;

  return (
    <motion.div {...pageMotion}>
      <main>
        <section className="home-hero page-wrap">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> Independent perspectives on what comes next</div>
            <h1>The future,<br /><span>in focus.</span></h1>
            <p>Stories and ideas at the edge of intelligence, technology, and the way we live.</p>
            <div className="hero-actions"><Link className="button button-primary" to="/latest">Explore the journal <ArrowRight size={16} /></Link><Link className="button button-quiet" to="/about">Our point of view <ArrowDownRight size={16} /></Link></div>
            <div className="hero-footnote"><span className="hero-footnote-mark"><Sparkles size={14} /></span><span>{live ? 'Reporting linked to original sources' : 'Independent thinking, clearly labeled sample edition'}</span></div>
          </div>
          <Link to={`/article/${lead.slug}`} className="hero-feature" aria-label={`Read ${lead.title}`}>
            <ImageFrame story={lead} className="hero-feature-image" />
            <div className="feature-overlay"><div className="feature-tags"><span>{lead.categoryLabel}</span><span>{lead.readTime}</span></div><h2>{lead.title}</h2><p>{lead.excerpt}</p><span className="feature-read">Read the story <ArrowUpRight size={15} /></span></div>
          </Link>
          <div className="hero-index"><span>01</span><span className="hero-index-line" /><span>03</span><span className="hero-index-label">EDITOR'S PICKS</span></div>
        </section>

        <section className="ticker-band" aria-label="Journal focus areas"><div className="ticker-inner"><span>INTELLIGENCE</span><span className="ticker-star">✳</span><span>NEW MACHINES</span><span className="ticker-star">✳</span><span>HUMAN SYSTEMS</span><span className="ticker-star">✳</span><span>BETTER QUESTIONS</span><span className="ticker-star">✳</span><span>INTELLIGENCE</span></div></section>

        <section className="page-wrap home-latest section-space">
          <SectionHeading eyebrow="01 / The latest" title="Ideas in motion" detail="A closer look at the shifts shaping tomorrow." link={{ label: 'View all stories', to: '/latest' }} />
          <StoryGrid stories={latest} bookmarks={bookmarks} onBookmark={onBookmark} />
        </section>

        <section className="trend-band">
          <div className="page-wrap trend-layout"><div className="trend-intro"><span className="eyebrow"><TrendingUp size={14} /> Curated reading</span><h2>Worth your<br />attention.</h2><p>Thoughtful reads, selected from across the journal.</p><Link className="text-link" to="/trending">Explore the selection <ArrowUpRight size={15} /></Link></div>
            <div className="trend-list">{sideStories.map((story, index) => <Link className="trend-item" to={`/article/${story.slug}`} key={story.id}><span className="trend-number">0{index + 1}</span><div><span className="category-label">{story.categoryLabel}</span><h3>{story.title}</h3><span className="trend-meta">{story.readTime} <span>·</span> {story.live ? formatDate(story.publishedAt) : 'Sample story'}</span></div><ArrowUpRight className="trend-arrow" size={18} /></Link>)}</div>
          </div>
        </section>

        <section className="page-wrap categories-strip section-space"><SectionHeading eyebrow="02 / Follow a thread" title="Explore by topic" link={{ label: 'All topics', to: '/categories' }} /><div className="topic-pills">{categories.map((category) => <Link className={`topic-pill tone-${category.tone}`} to={`/category/${category.slug}`} key={category.slug}><span className="topic-orb" />{category.name}<ArrowUpRight size={14} /></Link>)}</div></section>
        <NewsletterBand />
      </main>
    </motion.div>
  );
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages <= 1) return null;
  return <nav className="pagination" aria-label="Pagination"><button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page"><ChevronLeft size={17} /></button><span>Page <strong>{page}</strong> of {pages}</span><button type="button" onClick={() => onChange(page + 1)} disabled={page >= pages} aria-label="Next page"><ChevronRight size={17} /></button></nav>;
}

function ListingPage({ stories, bookmarks, onBookmark, loading, live, trending = false }: SharedProps & { trending?: boolean }) {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const sourceStories = trending ? stories.slice().sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel)) : stories;
  const pages = Math.max(1, Math.ceil(sourceStories.length / pageSize));
  const currentStories = sourceStories.slice((page - 1) * pageSize, page * pageSize);
  const title = trending ? 'Trending' : 'Latest stories';
  usePageTitle(title);
  return <motion.main className="page-wrap listing-page" {...pageMotion}>
    <div className="page-intro"><div className="eyebrow">{trending ? 'A considered shortlist' : live ? 'The latest from our sources' : 'Fresh perspectives, sample edition'}</div><h1>{trending ? <>In the <span>conversation.</span></> : <>The latest<br /><span>thinking.</span></>}</h1><p>{trending ? 'Stories selected to help you see where the conversation is moving.' : 'New perspectives on artificial intelligence and the technology changing our world.'}</p></div>
    <div className="listing-toolbar"><span>{loading ? 'Finding stories…' : `${sourceStories.length} ${live ? 'stories' : 'sample stories'}`}</span><div className="toolbar-rule" /><span>{live ? 'Source-linked reporting' : 'AI-generated sample edition'}</span></div>
    <StoryGrid stories={currentStories} bookmarks={bookmarks} onBookmark={onBookmark} loading={loading} />
    {!loading && <Pagination page={page} pages={pages} onChange={setPage} />}
  </motion.main>;
}

function CategoriesPage({ stories }: { stories: Story[] }) {
  usePageTitle('Topics');
  return <motion.main className="page-wrap listing-page" {...pageMotion}><div className="page-intro"><div className="eyebrow">A map of what matters</div><h1>Follow a <span>thread.</span></h1><p>Explore the ideas and disciplines shaping the technology conversation.</p></div><div className="category-grid">{categories.map((category, index) => <Link className={`category-tile tone-${category.tone}`} to={`/category/${category.slug}`} key={category.slug}><span className="category-tile-index">0{index + 1} / TOPIC</span><span className="category-tile-orb" /><h2>{category.name}</h2><span className="category-tile-count">{stories.filter((story) => story.category === category.slug).length} {stories.filter((story) => story.category === category.slug).length === 1 ? 'story' : 'stories'}</span><ArrowUpRight className="category-tile-arrow" size={19} /></Link>)}</div></motion.main>;
}

function CategoryPage({ stories, bookmarks, onBookmark }: SharedProps) {
  const { category: slug = '' } = useParams();
  const category = categories.find((item) => item.slug === slug);
  const filtered = stories.filter((story) => story.category === slug);
  usePageTitle(category?.name ?? 'Topic not found');
  if (!category) return <NotFound />;
  return <motion.main className="page-wrap listing-page" {...pageMotion}><div className="page-intro"><Link className="back-link" to="/categories"><ArrowLeft size={14} /> All topics</Link><div className="eyebrow">Topic / {category.slug.replace('-', ' ')}</div><h1>{category.name.split(' ').slice(0, -1).join(' ')} <span>{category.name.split(' ').slice(-1)[0]}.</span></h1><p>Ideas, questions, and new perspectives from across {category.name.toLowerCase()}.</p></div><StoryGrid stories={filtered} bookmarks={bookmarks} onBookmark={onBookmark} emptyTitle="No stories in this topic" emptyText="There are no stories here in this edition yet." /></motion.main>;
}

function SearchPage({ stories, bookmarks, onBookmark }: SharedProps) {
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim();
  const normalized = query.toLocaleLowerCase();
  const results = useMemo(() => stories.filter((story) => `${story.title} ${story.excerpt} ${story.categoryLabel} ${story.tags.join(' ')}`.toLocaleLowerCase().includes(normalized)), [normalized, stories]);
  usePageTitle(query ? `Search: ${query}` : 'Search');
  const [input, setInput] = useState(query);
  const navigate = useNavigate();
  useEffect(() => setInput(query), [query]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input.trim()) navigate(`/search?q=${encodeURIComponent(input.trim())}`);
  }
  return <motion.main className="page-wrap listing-page" {...pageMotion}><div className="page-intro"><div className="eyebrow">Search the journal</div><h1>Find your <span>signal.</span></h1><form className="large-search" onSubmit={submit}><Search size={19} /><input aria-label="Search the journal" placeholder="Try ‘machine learning’" value={input} onChange={(event) => setInput(event.target.value)} /><button className="button button-primary" type="submit">Search <ArrowRight size={15} /></button></form></div>{query && <><div className="listing-toolbar"><span>{results.length} result{results.length === 1 ? '' : 's'} for “{query}”</span><div className="toolbar-rule" /><span>Searches titles, topics, and summaries</span></div><StoryGrid stories={results} bookmarks={bookmarks} onBookmark={onBookmark} emptyTitle="No matches found" emptyText="Try a broader phrase or explore a topic instead." action={<Link className="text-link" to="/categories">Browse topics <ArrowRight size={15} /></Link>} /></>}</motion.main>;
}

function ArticlePage({ stories, bookmarks, onBookmark }: SharedProps) {
  const { slug } = useParams();
  const story = stories.find((item) => item.slug === slug);
  const [copied, setCopied] = useState(false);
  usePageTitle(story?.title ?? 'Story not found');
  if (!story) return <NotFound />;
  const article = story;
  const related = stories.filter((item) => item.category === story.category && item.id !== story.id).slice(0, 3);
  async function share() {
    const shareData = { title: article.title, text: article.excerpt, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  }
  return <motion.main className="article-page" {...pageMotion}>
    <div className="page-wrap article-topline"><Link className="back-link" to={story.live ? '/latest' : `/category/${story.category}`}><ArrowLeft size={14} /> {story.categoryLabel}</Link><div className="article-top-actions"><BookmarkButton saved={bookmarks.includes(story.id)} onClick={() => onBookmark(story.id)} /><button className="icon-button share-button" onClick={share} type="button" aria-label={copied ? 'Link copied' : 'Share story'} title={copied ? 'Link copied' : 'Share story'}>{copied ? <Check size={17} /> : <Share2 size={17} />}</button></div></div>
    <article className="page-wrap article-content"><div className="article-heading"><span className="eyebrow">{story.live ? 'From the news desk' : 'Signal / Sample edition'}</span><h1>{story.title}</h1><p className="article-deck">{story.excerpt}</p><div className="article-byline"><div className="author-avatar">{story.author.slice(0, 1)}</div><div><strong>{story.author}</strong><span>{story.live ? formatDate(story.publishedAt) : 'AI-generated sample'} <i /> {story.readTime}</span></div><Link className="category-label" to={`/category/${story.category}`}>{story.categoryLabel}</Link></div></div>
      <ImageFrame story={story} className="article-cover" />
      {!story.live && <div className="article-sample-note"><Sparkles size={15} /><span>This is an AI-generated sample article created for this publication demo. It is not real-time news or reporting.</span></div>}
      <div className="article-body-layout"><aside className="article-aside"><span className="eyebrow">IN THIS STORY</span><div className="article-tags">{story.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="text-link article-share-link" onClick={share} type="button">{copied ? 'Link copied' : 'Share this story'} {copied ? <Check size={15} /> : <Share2 size={15} />}</button></aside><div className="article-body">{story.live && story.url && <a className="source-link" href={story.url} target="_blank" rel="noreferrer">Read the complete story at {story.sourceName} <ExternalLink size={14} /></a>}{story.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{story.live && story.url && <a className="button button-primary source-button" href={story.url} target="_blank" rel="noreferrer">Continue to original source <ExternalLink size={15} /></a>}<div className="article-endmark"><span /> END OF STORY <span /></div></div></div>
    </article>
    {related.length > 0 && <section className="page-wrap related-section"><SectionHeading eyebrow="Keep exploring" title="Related perspectives" /><StoryGrid stories={related} bookmarks={bookmarks} onBookmark={onBookmark} /></section>}
  </motion.main>;
}

function BookmarksPage({ stories, bookmarks, onBookmark }: SharedProps) {
  const savedStories = stories.filter((story) => bookmarks.includes(story.id));
  usePageTitle('Saved stories');
  return <motion.main className="page-wrap listing-page" {...pageMotion}><div className="page-intro"><div className="eyebrow">Your reading list</div><h1>Keep what <span>matters.</span></h1><p>Stories you have saved for a little more time.</p></div><StoryGrid stories={savedStories} bookmarks={bookmarks} onBookmark={onBookmark} emptyTitle="Your reading list is clear" emptyText="Save a story with the bookmark icon and it will be waiting here." action={<Link className="button button-primary" to="/latest">Browse stories <ArrowRight size={15} /></Link>} /></motion.main>;
}

function AboutPage() {
  usePageTitle('About Signal');
  return <motion.main className="page-wrap editorial-page" {...pageMotion}><div className="editorial-kicker"><span className="eyebrow">A journal for the in-between</span><span className="editorial-index">S / 001</span></div><h1>Technology is never<br />just <span>technology.</span></h1><div className="editorial-columns"><div className="editorial-lead">Signal is an independent journal about the systems we build, the people they change, and the choices that shape what comes next.</div><div className="editorial-body"><p>We make room for the questions that arrive before the answers are settled. What does a new capability make possible? Who gets to decide how it is used? And what should we pay attention to while the future is still being made?</p><p>Our lens is curious, grounded, and human. We look across artificial intelligence, research, design, policy, and the everyday experience of living with new technology.</p><p className="editorial-small-note"><span className="notice-dot" /> This edition contains AI-generated sample articles, clearly identified as such. Live stories appear only when a publisher feed is configured.</p></div></div><div className="about-values"><div><span>01 / CURIOSITY</span><h2>Ask better questions.</h2><p>Look beyond the headline and find the human stakes underneath.</p></div><div><span>02 / CLARITY</span><h2>Make complexity legible.</h2><p>Useful context, precise language, and room for nuance.</p></div><div><span>03 / CARE</span><h2>Keep people in view.</h2><p>Technology is made by people and matters because of people.</p></div></div><Link className="button button-primary" to="/latest">Read the journal <ArrowRight size={15} /></Link></motion.main>;
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  usePageTitle('Contact');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }
  return <motion.main className="page-wrap contact-page" {...pageMotion}><div className="contact-intro"><span className="eyebrow">The conversation goes both ways</span><h1>Send us a <span>signal.</span></h1><p>Have a question, a thoughtful disagreement, or a story worth exploring? We would like to hear from you.</p><a className="contact-email" href="mailto:hello@signaljournal.example">hello@signaljournal.example <ArrowUpRight size={15} /></a><div className="contact-note"><span className="notice-dot" />This demo form confirms your message locally. Connect a form service to receive submissions.</div></div><form className="contact-form" onSubmit={submit}><label>Your name<input name="name" autoComplete="name" required placeholder="Name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>What is this about?<select name="subject" defaultValue="editorial"><option value="editorial">Editorial note</option><option value="partnership">Partnership</option><option value="question">A question</option><option value="other">Something else</option></select></label><label>Your message<textarea name="message" rows={5} required placeholder="Write a few lines..." /></label><button className="button button-primary" type="submit" disabled={submitted}>{submitted ? <>Message noted <Check size={15} /></> : <>Send message <Send size={15} /></>}</button>{submitted && <p className="form-success" role="status">Thanks for reaching out. Your message has been acknowledged in this demo.</p>}</form></motion.main>;
}

function NewsletterBand() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim().toLocaleLowerCase();
    if (!address) return;
    const existing = readStored<string[]>('signal-newsletter', []);
    if (!existing.includes(address)) localStorage.setItem('signal-newsletter', JSON.stringify([...existing, address]));
    setSubscribed(true);
  }
  return <section className="newsletter-band"><div className="page-wrap newsletter-layout"><div><span className="eyebrow">A little perspective, occasionally</span><h2>Stay close to<br /><span>what's next.</span></h2><p>One considered note from the journal, delivered when there is something worth sharing.</p></div><form className="newsletter-form" onSubmit={subscribe}><label htmlFor="newsletter-email">The Signal Letter</label><div className="newsletter-input-row"><input id="newsletter-email" type="email" autoComplete="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={subscribed} /><button className="button button-primary" type="submit" disabled={subscribed}>{subscribed ? <><Check size={16} /> You're on the list</> : <>Subscribe <ArrowRight size={15} /></>}</button></div><span className="newsletter-footnote" role={subscribed ? 'status' : undefined}>{subscribed ? 'Your address is saved in this browser.' : 'No noise. Unsubscribe whenever you like.'}</span></form></div></section>;
}

function Footer() {
  return <footer className="site-footer"><div className="page-wrap footer-main"><div className="footer-brand-block"><Link className="brand" to="/"><span className="brand-mark"><span /></span><span>signal<span className="brand-period">.</span></span></Link><p>Independent perspectives<br />on what comes next.</p></div><div className="footer-column"><span className="eyebrow">Explore</span><Link to="/latest">Latest stories</Link><Link to="/trending">Trending</Link><Link to="/categories">Topics</Link><Link to="/bookmarks">Saved stories</Link></div><div className="footer-column"><span className="eyebrow">Signal</span><Link to="/about">About us</Link><Link to="/contact">Contact</Link><a href="mailto:hello@signaljournal.example">Email the editors</a></div><div className="footer-mark" aria-hidden="true">S<span>.</span></div></div><div className="page-wrap footer-bottom"><span>© {new Date().getFullYear()} Signal Journal</span><span>Curious by design. Clear about what we know.</span><Link to="/about">Editorial note <ArrowUpRight size={12} /></Link></div></footer>;
}

function NotFound() {
  usePageTitle('Page not found');
  return <motion.main className="page-wrap not-found" {...pageMotion}><span className="eyebrow">404 / Lost in the feed</span><h1>This page went<br /><span>off signal.</span></h1><p>The story or page you were looking for is not in this edition.</p><Link className="button button-primary" to="/">Back to the journal <ArrowRight size={15} /></Link></motion.main>;
}

function formatDate(value: string) {
  if (!value || value === 'Sample edition') return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date);
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => readStored<Theme>('signal-theme', 'dark'));
  const [bookmarks, setBookmarks] = useState<string[]>(() => readStored<string[]>('signal-bookmarks', []));
  const [stories, setStories] = useState<Story[]>(demoStories);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('signal-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('signal-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    let active = true;
    fetch('/api/news')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('News feed unavailable')))
      .then((payload: { live?: boolean; articles?: Story[] }) => {
        if (active && payload.live && payload.articles?.length) {
          setStories(payload.articles);
          setLive(true);
        }
      })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname, location.search]);

  function toggleBookmark(id: string) {
    setBookmarks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return <div className="app-shell"><Header theme={theme} setTheme={setTheme} /><SampleNotice live={live} /><AnimatePresence mode="wait"><Routes location={location} key={`${location.pathname}${location.search}`}>
    <Route path="/" element={<HomePage stories={stories} bookmarks={bookmarks} onBookmark={toggleBookmark} live={live} loading={loading} />} />
    <Route path="/latest" element={<ListingPage stories={stories} bookmarks={bookmarks} onBookmark={toggleBookmark} live={live} loading={loading} />} />
    <Route path="/trending" element={<ListingPage stories={stories} bookmarks={bookmarks} onBookmark={toggleBookmark} live={live} loading={loading} trending />} />
    <Route path="/categories" element={<CategoriesPage stories={stories} />} />
    <Route path="/category/:category" element={<CategoryPage stories={stories} bookmarks={bookmarks} onBookmark={toggleBookmark} live={live} loading={loading} />} />
    <Route path="/article/:slug" element={<ArticlePage stories={stories} bookmarks={bookmarks} onBookmark={toggleBookmark} live={live} loading={loading} />} />
    <Route path="/search" element={<SearchPage stories={stories} bookmarks={bookmarks} onBookmark={toggleBookmark} live={live} loading={loading} />} />
    <Route path="/bookmarks" element={<BookmarksPage stories={stories} bookmarks={bookmarks} onBookmark={toggleBookmark} live={live} loading={loading} />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes></AnimatePresence><Footer /></div>;
}
