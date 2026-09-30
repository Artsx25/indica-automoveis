// src/components/vehicle/VehicleCard.tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Eye, Fuel, Settings, Calendar, Gauge } from 'lucide-react'
import type { Vehicle } from '@/domain/vehicle.types'
import { TRANSMISSION_LABELS, FUEL_LABELS, BODY_TYPE_LABELS } from '@/domain/vehicle.types'
import { formatCurrency, formatMileage, formatYearRange } from '@/lib/format'
import { useWhatsAppLead } from '@/hooks/useWhatsAppLead'
import { track } from '@/lib/analytics'
import { Badge } from '@/components/ui/Badge'
import styles from './VehicleCard.module.css'

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const [imgError, setImgError] = useState(false)
  const { getVehicleInquiryUrl } = useWhatsAppLead()

  const whatsappUrl = getVehicleInquiryUrl(vehicle)

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    track('click_whatsapp', { vehicle_id: vehicle.id, location: 'card' })
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCardClick = () => {
    track('click_vehicle_card', { vehicle_id: vehicle.id })
  }

  return (
    <article className={styles.card}>
      <Link
        to={`/veiculo/${vehicle.slug}`}
        className={styles.imageLink}
        onClick={handleCardClick}
        aria-label={`Ver detalhes do ${vehicle.title}`}
      >
        {imgError ? (
          <div className={styles.imgPlaceholder} aria-label="Imagem indisponível">
            <Settings size={40} />
            <span>Foto indisponível</span>
          </div>
        ) : (
          <img
            src={vehicle.coverImage}
            alt={`${vehicle.title} — foto principal`}
            className={styles.image}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        {/* Badges */}
        <div className={styles.badges}>
          {vehicle.featured && vehicle.status === 'available' && (
            <Badge variant="featured">Destaque</Badge>
          )}
          {vehicle.status === 'reserved' && (
            <Badge variant="reserved">Reservado</Badge>
          )}
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.make}>{vehicle.make}</span>
          <span className={styles.bodyType}>{BODY_TYPE_LABELS[vehicle.bodyType]}</span>
        </div>

        <Link to={`/veiculo/${vehicle.slug}`} className={styles.titleLink} onClick={handleCardClick}>
          <h3 className={styles.title}>{vehicle.title}</h3>
          <p className={styles.version}>{vehicle.version}</p>
        </Link>

        <div className={styles.specs}>
          <div className={styles.spec}>
            <Calendar size={14} />
            <span>{formatYearRange(vehicle.yearManufacture, vehicle.yearModel)}</span>
          </div>
          <div className={styles.spec}>
            <Gauge size={14} />
            <span>{formatMileage(vehicle.mileageKm)}</span>
          </div>
          <div className={styles.spec}>
            <Settings size={14} />
            <span>{TRANSMISSION_LABELS[vehicle.transmission]}</span>
          </div>
          <div className={styles.spec}>
            <Fuel size={14} />
            <span>{FUEL_LABELS[vehicle.fuel]}</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.price}>{formatCurrency(vehicle.price)}</div>
          <div className={styles.ctas}>
            <Link
              to={`/veiculo/${vehicle.slug}`}
              className={styles.detailBtn}
              onClick={handleCardClick}
              aria-label={`Ver detalhes do ${vehicle.title}`}
            >
              <Eye size={16} />
              <span>Detalhes</span>
            </Link>
            <button
              className={styles.whatsappBtn}
              onClick={handleWhatsAppClick}
              aria-label={`Falar com vendedor sobre ${vehicle.title} no WhatsApp`}
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
