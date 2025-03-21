import { Button } from "@/components/ui/button"
import { ImageIcon, Sparkles } from "lucide-react"
import Image from "next/image"
import { ImageGenerator } from "@/components/image-generator"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="empire-font mb-6">
              <span className="large-letter">T</span>INY <span className="large-letter">M</span>ODERN
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Generate stunning architectural concepts with our AI-powered platform. From modern minimalist to
              futuristic designs, bring your ideas to life in seconds.
            </p>
          </div>
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-row justify-center gap-4">
              <Button asChild size="lg" className="gap-2 text-lg py-6 px-8 h-auto">
                <a href="#create">
                  <Sparkles className="h-5 w-5" />
                  Start Creating
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 text-lg py-6 px-8 h-auto">
                <a href="#gallery">
                  <ImageIcon className="h-5 w-5" />
                  View Gallery
                </a>
              </Button>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-lg border shadow-xl w-full max-w-4xl">
              <Image
                src="/images/hero-ocean-house.jpg"
                alt="Rectangle glass modern house on the ocean"
                width={1200}
                height={800}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white text-sm">Rectangle glass modern house on the ocean</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="create" className="py-16 bg-muted/50 scroll-mt-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Generate Your Architectural Vision</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Describe your architectural concept, adjust the settings, and let our AI bring your vision to life.
            </p>
          </div>

          <ImageGenerator />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 scroll-mt-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Inspiration Gallery</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore stunning AI-generated architectural designs created by our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: '/images/gallery/aframe-forest.jpg',
                title: 'Modern A-Frame Cabin',
                description: 'Minimalist A-frame design nestled in a pine forest',
              },
              {
                src: '/images/gallery/glass-house-forest.jpg',
                title: 'Glass Forest Pavilion',
                description: 'Contemporary glass house surrounded by nature',
              },
              {
                src: '/images/gallery/circle-pod.jpg',
                title: 'Circular Forest Pod',
                description: 'Innovative circular design with panoramic views',
              },
              {
                src: '/images/gallery/modern-rectangle.jpg',
                title: 'Modern Rectangle Villa',
                description: 'Sleek rectangular design with outdoor living space',
              },
              {
                src: '/images/gallery/mountain-cabin.jpg',
                title: 'Mountain View Cabin',
                description: 'Cozy cabin with breathtaking mountain vistas',
              },
              {
                src: '/images/gallery/wood-pod.jpg',
                title: 'Woodland Pod Retreat',
                description: 'Unique pod design in a serene forest setting',
              },
            ].map((item, i) => (
              <div key={i} className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button variant="outline" size="lg">
              View All Designs
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

