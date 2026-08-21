export const Footer = () => {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <span className="font-extrabold text-2xl tracking-tight text-primary">Align</span>
                <span className="text-accent text-3xl leading-none font-black">.</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/5 text-text-secondary border border-border">
                by Schbang
              </span>
            </div>
            <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
              Where creative frequency meets brand purpose. India&apos;s definitive creator collaboration platform powered by Schbang.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/brands" className="hover:text-accent transition-colors">Explore Brands</a></li>
              <li><a href="/auth/register" className="hover:text-accent transition-colors">Creator Network</a></li>
              <li><a href="/dashboard" className="hover:text-accent transition-colors">Track Applications</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="https://schbang.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">About Schbang</a></li>
              <li><a href="https://schbang.com/contact-us" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Align. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-medium">A <span className="text-primary font-bold">Schbang</span> Technology Product</p>
        </div>
      </div>
    </footer>
  );
};
