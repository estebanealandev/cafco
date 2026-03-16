"use client";

import { useTranslations, useLocale } from "next-intl";
import { useSmoothScroll } from "@/lib/gsap-setup";
import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import Image from "next/image";

const WA_NUMBER = "50661073836";
const WA_BASE = `https://wa.me/${WA_NUMBER}`;
const IG_URL = "https://www.instagram.com/cafco.cr/";

const productImages = {
  a01v60:
    "https://static.wixstatic.com/media/dd3e2a_35ad97e5df714f438a45a3239e82f1c9~mv2.png/v1/fill/w_800,h_982,al_c,q_90,enc_avif,quality_auto/A01_2.png",
  a01bag:
    "https://static.wixstatic.com/media/dd3e2a_d236366fc471471291dfed27c2b1251e~mv2.png/v1/fill/w_800,h_980,al_c,q_90,enc_avif,quality_auto/dd3e2a_d236366fc471471291dfed27c2b1251e~mv2.png",
  a02v60:
    "https://static.wixstatic.com/media/dd3e2a_d1ff40fb42a44f33a31a8825045370cd~mv2.png/v1/fill/w_800,h_988,al_c,q_90,enc_avif,quality_auto/A02_2.png",
  a02bag:
    "https://static.wixstatic.com/media/dd3e2a_19b1e63281cc465eb45a36a942d964ad~mv2.png/v1/fill/w_800,h_988,al_c,q_90,enc_avif,quality_auto/A02_4.png",
  audienceImg:
    "https://static.wixstatic.com/media/dd3e2a_ef54d6f223744553943554738ee99ac4~mv2.png/v1/fill/w_800,h_982,al_c,q_90,enc_avif,quality_auto/A01_A02_JUNTOS.png",
  storyImg:
    "https://static.wixstatic.com/media/dd3e2a_beddd3b6f29c49e1ae3df2a09c1e7a59~mv2.png/v1/fill/w_800,h_982,al_c,q_90,enc_avif,quality_auto/DETALLE%20DE%20TEXTURA%202.png",
  hero: "A02_2.png",
};

const waIcon =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

function WaIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={waIcon} />
    </svg>
  );
}

type ProductKey = "a01v60" | "a01bag" | "a02v60" | "a02bag";
type TabKey = "all" | "a01" | "a02";

interface ProductDef {
  key: ProductKey;
  model: "a01" | "a02";
  img: string;
  waText: string;
}

const allProducts: ProductDef[] = [
  {
    key: "a01v60",
    model: "a01",
    img: productImages.a01v60,
    waText:
      "Hola%2C%20quiero%20ordenar%20el%20Chorreador%20A01%20con%20Dripper%20V60",
  },
  {
    key: "a01bag",
    model: "a01",
    img: productImages.a01bag,
    waText:
      "Hola%2C%20quiero%20ordenar%20el%20Chorreador%20A01%20con%20Bolsa%20de%20Tela",
  },
  {
    key: "a02v60",
    model: "a02",
    img: productImages.a02v60,
    waText:
      "Hola%2C%20quiero%20ordenar%20el%20Chorreador%20A02%20con%20Dripper%20V60",
  },
  {
    key: "a02bag",
    model: "a02",
    img: productImages.a02bag,
    waText:
      "Hola%2C%20quiero%20ordenar%20el%20Chorreador%20A02%20con%20Bolsa%20de%20Tela",
  },
];

function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="locale-switcher">
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={(e) => onSelectChange(e.target.value)}
        className="locale-select"
        aria-label="Seleccionar idioma"
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
        <option value="fr">FR</option>
        <option value="de">DE</option>
      </select>
    </div>
  );
}

export default function Home() {
  const t = useTranslations("Index");
  useSmoothScroll();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById("mainNav");
    const handleScroll = () => {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );
    for (const el of document.querySelectorAll(".reveal")) {
      obs.observe(el);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      obs.disconnect();
    };
  }, []);

  /* Re-observe product cards when tab changes */
  useEffect(() => {
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.05 },
      );
      for (const el of document.querySelectorAll(
        ".product-card.reveal:not(.visible)",
      )) {
        obs.observe(el);
      }
      return () => obs.disconnect();
    }, 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  function smoothScroll(
    e: React.MouseEvent<HTMLAnchorElement>,
    selector: string,
  ) {
    e.preventDefault();
    const target = document.querySelector(selector);
    if (target) {
      const nav = document.getElementById("mainNav");
      const offset = (nav?.offsetHeight || 60) + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const visibleProducts =
    activeTab === "all"
      ? allProducts
      : allProducts.filter((p) => p.model === activeTab);

  return (
    <>
      {/* ═══════════════ ANNOUNCEMENT ═══════════════ */}
      <div className="announcement">
        <span>
          {t("announcement")}{" "}
          <a href={WA_BASE} target="_blank" rel="noopener noreferrer">
            {t("announcementWa")}
          </a>{" "}
          {t("announcementAnd")}{" "}
          <a href={IG_URL} target="_blank" rel="noopener noreferrer">
            {t("announcementIg")}
          </a>
        </span>
      </div>

      {/* ═══════════════ NAV ═══════════════ */}
      <nav className="nav" id="mainNav">
        <div className="nav-inner">
          <ul className="nav-links">
            <li>
              <a href="#modelos" onClick={(e) => smoothScroll(e, "#modelos")}>
                {t("nav.models")}
              </a>
            </li>
            <li>
              <a
                href="#materiales"
                onClick={(e) => smoothScroll(e, "#materiales")}
              >
                {t("nav.materials")}
              </a>
            </li>
            <li>
              <a
                href="#preparacion"
                onClick={(e) => smoothScroll(e, "#preparacion")}
              >
                {t("nav.preparation")}
              </a>
            </li>
            <li>
              <a href="#nosotros" onClick={(e) => smoothScroll(e, "#nosotros")}>
                {t("nav.about")}
              </a>
            </li>
          </ul>
          <a href="#" className="nav-logo" onClick={(e) => e.preventDefault()}>
            CAFCO
          </a>
          <div className="nav-actions">
            <a
              href={WA_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa"
            >
              <WaIcon /> {t("nav.order")}
            </a>
            <LocaleSwitcher />
            <button
              className="menu-toggle"
              aria-label="Menú"
              onClick={() => setMobileMenuOpen(true)}
            >
              <div className="menu-toggle-lines">
                <span></span>
                <span></span>
              </div>
              Menú
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════ MOBILE MENU ═══════════════ */}
      <div
        className={`mobile-menu${mobileMenuOpen ? " active" : ""}`}
        id="mobileMenu"
      >
        <button
          className="mobile-close"
          onClick={() => setMobileMenuOpen(false)}
        >
          &#10005;
        </button>
        <a
          href="#modelos"
          onClick={(e) => {
            smoothScroll(e, "#modelos");
            setMobileMenuOpen(false);
          }}
        >
          {t("nav.models")}
        </a>
        <a
          href="#materiales"
          onClick={(e) => {
            smoothScroll(e, "#materiales");
            setMobileMenuOpen(false);
          }}
        >
          {t("nav.materials")}
        </a>
        <a
          href="#preparacion"
          onClick={(e) => {
            smoothScroll(e, "#preparacion");
            setMobileMenuOpen(false);
          }}
        >
          {t("nav.preparation")}
        </a>
        <a
          href="#nosotros"
          onClick={(e) => {
            smoothScroll(e, "#nosotros");
            setMobileMenuOpen(false);
          }}
        >
          {t("nav.about")}
        </a>
        <div style={{ marginTop: "2rem" }}>
          <LocaleSwitcher />
        </div>
        <a
          href={WA_BASE}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--color-wa)" }}
        >
          {t("nav.order")} por WhatsApp
        </a>
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero" id="inicio">
        <div className="hero-bg">
          <Image
            src="https://pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev/hero-1.webp"
            alt="Chorreador CAFCO"
            className="hero-product-image"
            fill
            priority
            sizes="100vw"
            quality={90}
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-eyebrow">{t("hero.eyebrow")}</p>
          <h1 dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }}></h1>
          <p className="hero-subtitle">{t("hero.subtitle")}</p>
          <div className="hero-ctas">
            <a
              href="#modelos"
              className="btn btn-primary"
              onClick={(e) => smoothScroll(e, "#modelos")}
            >
              {t("hero.ctaPrimary")}
            </a>
            <a
              href={`${WA_BASE}?text=Hola%2C%20quiero%20ordenar%20un%20chorreador%20CAFCO`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <WaIcon /> {t("hero.ctaWa")}
            </a>
          </div>
        </div>
        {/* Scroll arrow — centered bottom */}
        <a
          href="#modelos"
          className="hero-scroll-arrow"
          aria-label="Scroll down"
          onClick={(e) => smoothScroll(e, "#modelos")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M12 5v14M5 12l7 7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </section>

      {/* ═══════════════ FEATURED STRIP ═══════════════ */}
      <div className="featured-strip">
        <div className="featured-strip-item">
          <h3>{t("features.f1Title")}</h3>
          <p>{t("features.f1Desc")}</p>
        </div>
        <div className="featured-strip-item">
          <h3>{t("features.f2Title")}</h3>
          <p>{t("features.f2Desc")}</p>
        </div>
        <div className="featured-strip-item">
          <h3>{t("features.f3Title")}</h3>
          <p>{t("features.f3Desc")}</p>
        </div>
        <div className="featured-strip-item">
          <h3>{t("features.f4Title")}</h3>
          <p>{t("features.f4Desc")}</p>
        </div>
      </div>

      {/* ═══════════════ MANIFESTO ═══════════════ */}
      <section className="manifesto">
        <div className="container">
          <div className="manifesto-inner reveal">
            <h2 dangerouslySetInnerHTML={{ __html: t.raw("manifesto") }}></h2>
          </div>
        </div>
      </section>

      {/* ═══════════════ CATALOG ═══════════════ */}
      <section className="catalog container" id="modelos">
        <div className="catalog-header reveal">
          <h2>{t("catalog.title")}</h2>
          <p>{t("catalog.desc")}</p>
        </div>
        <div className="catalog-tabs reveal">
          {(["all", "a01", "a02"] as TabKey[]).map((tab) => (
            <button
              key={tab}
              className={`catalog-tab${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all"
                ? t("catalog.tabAll")
                : tab === "a01"
                  ? t("catalog.tabA01")
                  : t("catalog.tabA02")}
            </button>
          ))}
        </div>

        {visibleProducts.map((product, i) => {
          const p = t.raw(`products.${product.key}`) as Record<string, string>;
          return (
            <div
              className="product-card reveal"
              key={product.key}
              data-model={product.model}
            >
              <div className="product-card-gallery">
                <Image
                  src={product.img}
                  alt={`CAFCO ${product.key}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  loading={i === 0 ? "eager" : "lazy"}
                />
                {p.badge && <span className="product-badge">{p.badge}</span>}
              </div>
              <div className="product-card-info">
                <p className="product-eyebrow">{p.eyebrow}</p>
                <h3 dangerouslySetInnerHTML={{ __html: p.name }}></h3>
                <p className="product-card-tagline">{p.tagline}</p>
                <p className="product-card-desc">{p.desc}</p>
                <div className="product-includes">
                  <h4>{p.includesTitle}</h4>
                  <ul>
                    <li>{p.include1}</li>
                    <li>{p.include2}</li>
                    <li>{p.include3}</li>
                  </ul>
                </div>
                <div className="product-price-row">
                  <span className="product-price">{p.price}</span>
                  <span className="product-price-note">{p.priceNote}</span>
                </div>
                <div className="product-card-actions">
                  <a
                    href={`${WA_BASE}?text=${product.waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa btn-sm"
                  >
                    <WaIcon size={14} /> {p.cta}
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {/* ═══════════════ COMPARE TABLE ═══════════════ */}
        <div className="compare reveal">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                <th>A01 + V60</th>
                <th>A01 + Bolsa</th>
                <th>A02 + V60</th>
                <th>A02 + Bolsa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t("compare.scale")}</td>
                <td>{t("compare.sharing")}</td>
                <td>{t("compare.sharing")}</td>
                <td>{t("compare.personal")}</td>
                <td>{t("compare.personal")}</td>
              </tr>
              <tr>
                <td>{t("compare.weight")}</td>
                <td>6 kg</td>
                <td>6 kg</td>
                <td>2 kg</td>
                <td>2 kg</td>
              </tr>
              <tr>
                <td>{t("compare.wood")}</td>
                <td>{t("compare.teca")}</td>
                <td>{t("compare.teca")}</td>
                <td>{t("compare.teca")}</td>
                <td>{t("compare.teca")}</td>
              </tr>
              <tr>
                <td>{t("compare.filter")}</td>
                <td>{t("compare.dripperV60")}</td>
                <td>{t("compare.clothBag")}</td>
                <td>{t("compare.dripperV60")}</td>
                <td>{t("compare.clothBag")}</td>
              </tr>
              <tr>
                <td>{t("compare.price")}</td>
                <td className="price-cell">₡50,000</td>
                <td className="price-cell">₡45,000</td>
                <td className="price-cell">₡35,000</td>
                <td className="price-cell">₡30,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════ MATERIALS ═══════════════ */}
      <section className="materials" id="materiales">
        <div className="container">
          <div className="catalog-header reveal">
            <h2>{t("materials.title")}</h2>
            <p>{t("materials.desc")}</p>
          </div>
          <div className="materials-grid">
            <div className="material-card reveal reveal-d1">
              <svg
                className="material-icon"
                viewBox="0 0 48 48"
                fill="none"
                stroke="rgba(245,241,236,0.4)"
                strokeWidth="1.5"
              >
                <rect x="8" y="12" width="32" height="28" rx="1" />
                <path
                  d="M14 20h20M14 28h14M14 36h8"
                  stroke="rgba(245,241,236,0.25)"
                />
              </svg>
              <h3>{t("materials.m1")}</h3>
              <p>{t("materials.m1d")}</p>
            </div>
            <div className="material-card reveal reveal-d2">
              <svg
                className="material-icon"
                viewBox="0 0 48 48"
                fill="none"
                stroke="rgba(245,241,236,0.4)"
                strokeWidth="1.5"
              >
                <path d="M24 4v40M16 8c4 4 12 4 16 0M12 16c6 4 18 4 24 0M10 24c7 4 21 4 28 0M12 32c6 4 18 4 24 0M16 40c4 4 12 4 16 0" />
              </svg>
              <h3>{t("materials.m2")}</h3>
              <p>{t("materials.m2d")}</p>
            </div>
            <div className="material-card reveal reveal-d3">
              <svg
                className="material-icon"
                viewBox="0 0 48 48"
                fill="none"
                stroke="rgba(245,241,236,0.4)"
                strokeWidth="1.5"
              >
                <path d="M12 8l24 0M8 8c0 20 8 32 16 36C32 40 40 28 40 8" />
                <path
                  d="M16 16c0 12 4 20 8 24 4-4 8-12 8-24"
                  stroke="rgba(245,241,236,0.2)"
                />
              </svg>
              <h3>{t("materials.m3")}</h3>
              <p>{t("materials.m3d")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BREW GUIDE ═══════════════ */}
      <section className="brew-guide container" id="preparacion">
        <div className="catalog-header reveal">
          <h2>{t("brew.title")}</h2>
          <p>{t("brew.desc")}</p>
        </div>
        <div className="brew-steps">
          <div className="brew-step reveal reveal-d1">
            <h3>{t("brew.s1")}</h3>
            <p>{t("brew.s1d")}</p>
          </div>
          <div className="brew-step reveal reveal-d2">
            <h3>{t("brew.s2")}</h3>
            <p>{t("brew.s2d")}</p>
          </div>
          <div className="brew-step reveal reveal-d3">
            <h3>{t("brew.s3")}</h3>
            <p>{t("brew.s3d")}</p>
          </div>
          <div className="brew-step reveal">
            <h3>{t("brew.s4")}</h3>
            <p>{t("brew.s4d")}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════ AUDIENCE ═══════════════ */}
      <section className="audience">
        <div className="container">
          <div className="audience-grid">
            <div className="audience-left reveal">
              <h2
                dangerouslySetInnerHTML={{ __html: t.raw("audience.title") }}
              ></h2>
              <div className="audience-negatives">
                <p>{t("audience.neg1")}</p>
                <p>{t("audience.neg2")}</p>
                <p>{t("audience.neg3")}</p>
                <p>{t("audience.neg4")}</p>
              </div>
              <ul className="audience-positives">
                <li>{t("audience.pos1")}</li>
                <li>{t("audience.pos2")}</li>
                <li>{t("audience.pos3")}</li>
                <li>{t("audience.pos4")}</li>
                <li>{t("audience.pos5")}</li>
              </ul>
              <div className="audience-cta">
                <p>{t("audience.cta")}</p>
                <a
                  href={`${WA_BASE}?text=Hola%2C%20quiero%20ordenar%20mi%20chorreador%20CAFCO`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa btn-sm"
                >
                  <WaIcon size={14} /> {t("audience.ctaBtn")}
                </a>
              </div>
            </div>
            <div className="audience-image reveal reveal-d2">
              <Image
                src={productImages.audienceImg}
                alt="Chorreadores CAFCO A01 y A02 juntos"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonial-inner reveal">
            <blockquote className="testimonial-quote">
              {t("testimonials.q1")}
            </blockquote>
            <p className="testimonial-author">{t("testimonials.a1")}</p>
          </div>
        </div>
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      <section className="story container" id="nosotros">
        <div className="story-grid">
          <div className="story-image reveal">
            <Image
              src={productImages.storyImg}
              alt="Detalle de textura del concreto CAFCO"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
            />
          </div>
          <div className="story-content reveal reveal-d2">
            <p className="eyebrow">{t("story.eyebrow")}</p>
            <h2 dangerouslySetInnerHTML={{ __html: t.raw("story.title") }}></h2>
            <p>{t("story.p1")}</p>
            <p>{t("story.p2")}</p>
            <div className="story-values">
              <div className="story-value">
                <div className="number">{t("story.v1n")}</div>
                <label>{t("story.v1l")}</label>
              </div>
              <div className="story-value">
                <div className="number">{t("story.v2n")}</div>
                <label>{t("story.v2l")}</label>
              </div>
              <div className="story-value">
                <div className="number">{t("story.v3n")}</div>
                <label>{t("story.v3l")}</label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER ═══════════════ */}
      <section className="newsletter">
        <div className="container reveal">
          <h2>{t("newsletter.title")}</h2>
          <p>{t("newsletter.desc")}</p>
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              placeholder={t("newsletter.placeholder")}
              required
            />
            <button type="submit">{t("newsletter.btn")}</button>
          </form>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="nav-logo">CAFCO</span>
              <p>{t("footer.brandDesc")}</p>
            </div>
            <div className="footer-col">
              <h4>{t("footer.c1t")}</h4>
              <ul>
                <li>
                  <a
                    href="#modelos"
                    onClick={(e) => smoothScroll(e, "#modelos")}
                  >
                    {t("footer.c1l1")}
                  </a>
                </li>
                <li>
                  <a
                    href="#modelos"
                    onClick={(e) => smoothScroll(e, "#modelos")}
                  >
                    {t("footer.c1l2")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t("footer.c2t")}</h4>
              <ul>
                <li>
                  <a
                    href="#nosotros"
                    onClick={(e) => smoothScroll(e, "#nosotros")}
                  >
                    {t("footer.c2l1")}
                  </a>
                </li>
                <li>
                  <a
                    href="#materiales"
                    onClick={(e) => smoothScroll(e, "#materiales")}
                  >
                    {t("footer.c2l2")}
                  </a>
                </li>
                <li>
                  <a
                    href="#preparacion"
                    onClick={(e) => smoothScroll(e, "#preparacion")}
                  >
                    {t("footer.c2l3")}
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t("footer.c3t")}</h4>
              <ul>
                <li>
                  <a href={IG_URL} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={WA_BASE} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:cafco.cr@gmail.com">cafco.cr@gmail.com</a>
                </li>
                <li>
                  <a href="tel:+50661073836">+506 6107 3836</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t("footer.bott")}</p>
            <div className="footer-payment">
              <span>Sinpe Móvil</span>
              <span>Transferencia</span>
              <span>Efectivo</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════ WHATSAPP FLOAT ═══════════════ */}
      <a
        href={`${WA_BASE}?text=Hola%2C%20quiero%20información%20sobre%20CAFCO`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="WhatsApp"
      >
        <WaIcon size={28} />
      </a>
    </>
  );
}
