export type Story = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  categoryLabel: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  content: string[];
  live?: boolean;
  url?: string;
  sourceName?: string;
};

export const categories = [
  { slug: 'ai-research', name: 'AI & Research', tone: 'lime', count: '08' },
  { slug: 'machine-learning', name: 'Machine learning', tone: 'coral', count: '06' },
  { slug: 'robotics', name: 'Robotics', tone: 'blue', count: '04' },
  { slug: 'future-of-work', name: 'Future of work', tone: 'violet', count: '05' },
  { slug: 'ethics-policy', name: 'Ethics & policy', tone: 'yellow', count: '03' },
  { slug: 'climate-tech', name: 'Climate tech', tone: 'green', count: '04' },
];

export const demoStories: Story[] = [
  {
    id: 'sample-01', slug: 'the-next-interface-is-a-conversation',
    title: 'The next interface is a conversation',
    excerpt: 'As AI moves from a tool you open to a collaborator that stays, the most important design question is no longer what a screen can show. It is what a system should understand.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1500&q=85',
    category: 'ai-research', categoryLabel: 'AI & Research', author: 'The Signal Desk', publishedAt: 'Sample edition', readTime: '6 min read',
    tags: ['Interfaces', 'AI agents'],
    content: [
      'For decades, software waited patiently behind a button. We learned where to click, which menu to open, and how to translate an idea into the exact sequence a machine would accept. That contract is beginning to loosen. New AI systems invite us to start with intent instead of instruction.',
      'A conversational interface is not automatically a better one. The interesting work is deciding when a system should ask, when it should act, and how clearly it can show the difference between a confident answer and a useful guess. Trust is a product decision, not a tone of voice.',
      'The strongest designs may not look like chat at all. They will feel less like talking to a box and more like picking up a thread: context that travels with you, actions that remain visible, and a clear way to take the wheel back.',
    ],
  },
  {
    id: 'sample-02', slug: 'small-models-big-consequences',
    title: 'Small models, big consequences',
    excerpt: 'The race to make AI more capable has a quieter counterpart: making it compact enough to run close to the people who use it.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85',
    category: 'machine-learning', categoryLabel: 'Machine learning', author: 'Mira Chen', publishedAt: 'Sample edition', readTime: '5 min read',
    tags: ['On-device', 'Open models'],
    content: [
      'A model that runs locally changes the economics of an AI feature. Latency shrinks, private data can stay on-device, and a product becomes less dependent on a round trip to a remote service. Those benefits make smaller models a design choice as much as a technical one.',
      'Compression, quantization, and more efficient architectures have pushed useful capabilities into a smaller footprint. The tradeoffs remain real: developers must choose which tasks matter most and make graceful plans for requests that need more capacity.',
      'The most consequential shift may be who gets to build. When capable tools are cheaper to run, experimentation is no longer reserved for teams with access to enormous compute budgets.',
    ],
  },
  {
    id: 'sample-03', slug: 'robots-learn-the-language-of-space',
    title: 'Robots are learning the language of space',
    excerpt: 'A new generation of machines is being taught to reason about rooms, objects, and the small surprises that make the physical world so hard to automate.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=85',
    category: 'robotics', categoryLabel: 'Robotics', author: 'Jonah Reyes', publishedAt: 'Sample edition', readTime: '8 min read',
    tags: ['Embodied AI', 'Robotics'],
    content: [
      'A robot can recognize a cup and still have no idea how to pick it up. The gap between naming an object and understanding what can be done with it is one of the defining challenges in embodied AI.',
      'Researchers are combining visual models with physical feedback, giving machines a way to test a hypothesis against the real geometry of a room. A dropped object, a sticky drawer, or a chair that has moved becomes part of the learning loop.',
      'Reliable general-purpose robotics is still a long way off. But progress is arriving through systems designed to recover from mistakes, explain their next move, and learn from the unevenness of everyday environments.',
    ],
  },
  {
    id: 'sample-04', slug: 'the-new-shape-of-a-workday',
    title: 'The new shape of a workday',
    excerpt: 'When routine work becomes easier to delegate, teams are rediscovering that the hard part was never just the work. It was deciding what deserves attention.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85',
    category: 'future-of-work', categoryLabel: 'Future of work', author: 'Amara Wells', publishedAt: 'Sample edition', readTime: '7 min read',
    tags: ['Work', 'AI agents'],
    content: [
      'Automation has always changed the shape of a job before it changes the job title. AI assistants are already taking on small tasks that used to interrupt a day: summarizing a long thread, finding a detail, or producing a first draft.',
      'The harder question is what happens to the attention that gets returned. Organizations that simply fill every gap with more activity will miss the opportunity. Better work design makes room for judgment, collaboration, and time to think.',
      'There is no single future of work waiting to arrive. The choices made by managers, workers, and product teams will determine whether new tools create more agency or simply accelerate the old pace.',
    ],
  },
  {
    id: 'sample-05', slug: 'who-gets-to-audit-an-algorithm',
    title: 'Who gets to audit an algorithm?',
    excerpt: 'As automated systems make more consequential decisions, meaningful oversight depends on something less glamorous than a checklist: access to evidence.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85',
    category: 'ethics-policy', categoryLabel: 'Ethics & policy', author: 'Nadia Okafor', publishedAt: 'Sample edition', readTime: '9 min read',
    tags: ['Governance', 'Accountability'],
    content: [
      'An audit can only be as useful as the evidence an auditor is allowed to inspect. For automated decision systems, that evidence may include training data, design assumptions, evaluation results, and the way a system behaves after deployment.',
      'Independent access is difficult to negotiate when a system is proprietary and the people affected by it have little leverage. Yet accountability requires more than a promise that a model was tested. It requires a process that can surface who was missed and what changed.',
      'Good oversight should be legible to the people it is meant to protect. That means documenting decisions, creating routes to appeal, and treating transparency as an ongoing practice rather than a report published once.',
    ],
  },
  {
    id: 'sample-06', slug: 'climate-models-and-local-knowledge',
    title: 'Climate models meet local knowledge',
    excerpt: 'Machine learning can sharpen a forecast. The communities living with its consequences still need a voice in what the forecast is for.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=85',
    category: 'climate-tech', categoryLabel: 'Climate tech', author: 'Leo Park', publishedAt: 'Sample edition', readTime: '6 min read',
    tags: ['Climate', 'Data'],
    content: [
      'Better resolution can make a climate forecast more useful to people making decisions at a local scale. Machine learning is helping researchers work with increasingly complex environmental data and identify patterns that older models could miss.',
      'A sharper map does not automatically produce a fairer outcome. Local knowledge often captures constraints that are invisible in a dataset: the road that floods first, the neighborhood without cooling, or the warning that does not reach everyone.',
      'The most promising climate tools treat computation as one contributor to shared knowledge. Their success depends on the relationships built around the model as much as the model itself.',
    ],
  },
  {
    id: 'sample-07', slug: 'what-open-source-ai-makes-possible',
    title: 'What open-source AI makes possible',
    excerpt: 'Open weights are not a shortcut to safety, but they do invite a broader group of people to inspect, adapt, and challenge the tools now taking shape.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85',
    category: 'ai-research', categoryLabel: 'AI & Research', author: 'Mira Chen', publishedAt: 'Sample edition', readTime: '5 min read',
    tags: ['Open source', 'Research'],
    content: [
      'Open models can be studied, adapted, and run in places that a hosted service cannot reach. That flexibility has helped researchers and small teams explore ideas that would otherwise remain out of reach.',
      'Access alone does not guarantee transparency. A model can have open weights while the data, training process, and limitations remain difficult to understand. Responsible use still requires evaluation and clear documentation.',
      'The important question is not whether openness is always good or always risky. It is how communities can preserve the benefits of inspection and adaptation while responding to real misuse concerns.',
    ],
  },
  {
    id: 'sample-08', slug: 'designing-ai-that-knows-when-to-pause',
    title: 'Designing AI that knows when to pause',
    excerpt: 'A well-designed assistant is not the one that answers every prompt. It is the one that recognizes when a question deserves a little more care.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=85',
    category: 'machine-learning', categoryLabel: 'Machine learning', author: 'The Signal Desk', publishedAt: 'Sample edition', readTime: '4 min read',
    tags: ['Product design', 'Trust'],
    content: [
      'Speed is an easy feature to measure. A system either returned an answer quickly or it did not. Judgment is less tidy. It asks whether an answer should be given at all, and what kind of help would actually be useful.',
      'Designers can make uncertainty visible without turning every interaction into a warning. A system might ask a clarifying question, show what it used to reach a conclusion, or offer a path to a person when the stakes are high.',
      'The pause is not a failure to be helpful. Sometimes it is the clearest evidence that a system understands its limits.',
    ],
  },
];
