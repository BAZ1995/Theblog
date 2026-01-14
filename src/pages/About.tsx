import { Header } from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Code2, Mail, Github, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Author Section */}
          <section className="text-center mb-16">
            <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-accent/20">
              <AvatarImage src="/placeholder.svg" alt="Author" />
              <AvatarFallback className="text-3xl font-display bg-accent text-accent-foreground">
                TB
              </AvatarFallback>
            </Avatar>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              About The Author
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Tech enthusiast & photography lover
            </p>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <Link to="/contact">
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Bio Section */}
          <section className="prose prose-slate dark:prose-invert max-w-none mb-16">
            <h2 className="font-display text-2xl font-semibold text-foreground">My Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to TheBlog! I'm a passionate technologist and photographer who believes 
              in the power of storytelling through both code and images. With years of experience 
              in software development and a deep love for capturing moments through my lens, 
              I created this space to share insights, tutorials, and creative inspiration.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My journey began when I realized that technology and art aren't opposites—they're 
              complementary forces that can create something truly remarkable. Whether I'm writing 
              about the latest tech trends or sharing photography tips, my goal is to inspire 
              others to explore their own creative potential.
            </p>
          </section>

          {/* Interests */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-secondary/50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-tech/10 flex items-center justify-center">
                  <Code2 className="h-6 w-6 text-tech" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">Technology</h3>
              </div>
              <p className="text-muted-foreground">
                From web development to AI, I love exploring new technologies and sharing practical 
                insights that help others build amazing things.
              </p>
            </div>
            
            <div className="bg-secondary/50 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-photography/10 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-photography" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">Photography</h3>
              </div>
              <p className="text-muted-foreground">
                Capturing light and moments is my way of telling stories. I share techniques, 
                gear reviews, and the philosophy behind visual storytelling.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TheBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
