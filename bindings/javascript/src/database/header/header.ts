export interface DwgHeader {
  /**
   * The AutoCAD drawing database version number:
   * - AC1006: R10
   * - AC1009: R11 and R12
   * - AC1012: R13
   * - AC1014: R14
   * - AC1015: AutoCAD 2000
   * - AC1018: AutoCAD 2004
   * - AC1021: AutoCAD 2007
   * - AC1024: AutoCAD 2010
   * - AC1027: AutoCAD 2013
   * - AC1032: AutoCAD 2018
   */
  ACADVER?: string
  /**
   * The zero (0) base angle with respect to the current UCS.
   * Initial value:	0.0000
   */
  ANGBASE?: number
  /**
   * The direction of positive angles
   * Initial value:	0
   * - 0: Counterclockwise angles
   * - 1: Clockwise angles
   */
  ANGDIR?: number
  /**
   * Attribute visibility
   * Initial value:	1
   * - 0: Off: Makes all attributes invisible
   * - 1: Normal: Retains current visibility of each attribute; visible attributes are displayed; invisible attributes are not
   * - 2: On: Makes all attributes visible
   */
  ATTMODE?: number
  /**
   * Units format for angles
   * Initial value:	0
   * - 0: Decimal degrees
   * - 1: Degrees/minutes/seconds
   * - 2: Gradians
   * - 3: Radians
   * - 4: Surveyor's units
   */
  AUNITS?: number
  /**
   * The display precision for angular units and coordinates. However, the internal precision of angular
   * values and coordinates is always maintained, regardless of the display precision. AUPREC does not
   * affect the display precision of dimension text (see DIMSTYLE). Valid values are integers from 0 to 8.
   * Initial value:	0
   */
  AUPREC?: number
  /**
   * Current entity color number
   * 0 = BYBLOCK; 256 = BYLAYER
   * Initial value:	256
   */
  CECOLOR?: number
  /**
   * The linetype scaling for new objects relative to the LTSCALE command setting. A line created with
   * CELTSCALE = 2 in a drawing with LTSCALE set to 0.5 would appear the same as a line created with
   * CELTSCALE = 1 in a drawing with LTSCALE = 1.
   * Initial value:	1.0000
   */
  CELTSCALE?: number
  /**
   * Entity linetype name, or BYBLOCK or BYLAYER
   * Initial value:	BYLAYER
   */
  CELTYPE?: string
  /**
   * The lineweight of new objects.
   * Initial value:	-1
   * - -1: Sets the lineweight to "BYLAYER."
   * - -2: Sets the lineweight to "BYBLOCK."
   * - -3: Sets the lineweight to "DEFAULT." "DEFAULT" is controlled by the LWDEFAULT system variable.
   */
  CELWEIGHT?: number
  /**
   * Plotstyle handle of new objects; if CEPSNTYPE is 3, then this value indicates the handle
   */
  CEPSNID?: number
  /**
   * Plot style type of new objects:
   * - 0: Plot style by layer
   * - 1: Plot style by block
   * - 2: Plot style by dictionary default
   * - 3: Plot style by object ID/handle
   */
  CEPSNTYPE?: number
  /**
   * The first chamfer distance
   * Initial value:	0.0000
   */
  CHAMFERA?: number
  /**
   * The second chamfer distance
   * Initial value:	0.0000
   */
  CHAMFERB?: number
  /**
   * Chamfer length
   */
  CHAMFERC?: number
  /**
   * Chamfer angle
   */
  CHAMFERD?: number
  /**
   * Current layer name
   * Initial value:	'0'
   */
  CLAYER?: string
  /**
   * Current multiline justification
   * Initial value:	0
   * - 0: Top
   * - 1: Middle
   * - 2: Bottom
   */
  CMLJUST?: number
  /**
   * Current multiline scale. A scale factor of 2.0 produces a multiline twice as wide as the style
   * definition. A zero scale factor collapses the multiline into a single line. A negative scale
   * factor flips the order of the offset lines (that is, the smallest or most negative is placed
   * on top when the multiline is drawn from left to right).
   * Initial value:	1.0000 (imperial) or 20.0000 (metric)
   */
  CMLSCALE?: number
  /**
   * The multiline style that governs the appearance of the multiline.
   * Initial value:	'Standard'
   */
  CMLSTYLE?: string
  /**
   * Shadow mode for a 3D object
   * - 0: Casts and receives shadows
   * - 1: Casts shadows
   * - 2: Receives shadows
   * - 3: Ignores shadows
   * Note: Starting with AutoCAD 2016-based products, this variable is obsolete but still supported for
   * backwards compatibility.
   */
  CSHADOW?: number
  /**
   * The number of precision places displayed in angular dimensions
   * Initial value:	0
   * - -1: Angular dimensions display the number of decimal places specified by DIMDEC
   * - 0-8: Specifies the number of decimal places displayed in angular dimensions (independent of DIMDEC)
   */
  DIMADEC?: number
  /**
   * The display of alternate units in dimensions.
   * Initial value:	0
   * - 0: Disables alternate units
   * - 1: Enables alternate units
   */
  DIMALT?: number
  /**
   * The number of decimal places in alternate units. If DIMALT is turned on, DIMALTD sets the number of
   * digits displayed to the right of the decimal point in the alternate measurement.
   * Initial value:	2 (imperial) or 3 (metric)
   */
  DIMALTD?: number
  /**
   * The multiplier for alternate units. If DIMALT is turned on, DIMALTF multiplies linear dimensions by
   * a factor to produce a value in an alternate system of measurement. The initial value represents the
   * number of millimeters in an inch.
   * Initial value:	25.4000 (imperial) or 0.0394 (metric)
   */
  DIMALTF?: number
  /**
   * Rounds off the alternate dimension units.
   * Initial value:	0.0000
   */
  DIMALTRND?: number
  /**
   * The number of decimal places for the tolerance values in the alternate units of a dimension.
   * Initial value:	2 (imperial) or 3 (metric)
   */
  DIMALTTD?: number
  /**
   * Controls suppression of zeros for alternate tolerance values.
   * Initial value:	0
   * - 0: Suppresses zero feet and precisely zero inches
   * - 1: Includes zero feet and precisely zero inches
   * - 2: Includes zero feet and suppresses zero inches
   * - 3: Includes zero inches and suppresses zero feet
   *
   * To suppress leading or trailing zeros, add the following values to one of the preceding values:
   * - 4: Suppresses leading zeros
   * - 8: Suppresses trailing zeros
   */
  DIMALTTZ?: number
  /**
   * Units format for alternate units of all dimension style family members except angular:
   * Initial value:	2
   * - 1: Scientific
   * - 2: Decimal
   * - 3: Engineering
   * - 4: Architectural (stacked)
   * - 5: Fractional (stacked)
   * - 6: Architectural
   * - 7: Fractional
   * - 8: Operating system defines the decimal separator and number grouping symbols
   */
  DIMALTU?: number
  /**
   * Controls suppression of zeros for alternate unit dimension values.
   * Initial value:	0
   * - 0: Suppresses zero feet and precisely zero inches
   * - 1: Includes zero feet and precisely zero inches
   * - 2: Includes zero feet and suppresses zero inches
   * - 3: Includes zero inches and suppresses zero feet
   * - 4: Suppresses leading zeros in decimal dimensions
   * - 8: Suppresses trailing zeros in decimal dimensions
   * - 12: Suppresses both leading and trailing zeros
   */
  DIMALTZ?: number
  /**
   * Specifies a text prefix or suffix (or both) to the alternate dimension measurement for all types of
   * dimensions except angular. For instance, if the current units are Architectural, DIMALT is on,
   * DIMALTF is 25.4 (the number of millimeters per inch), DIMALTD is 2, and DIMAPOST is set to "mm",
   * a distance of 10 units would be displayed as 10"[254.00mm].
   * To turn off an established prefix or suffix (or both), set it to a single period (.).
   * Initial value:	""
   */
  DIMAPOST?: number
  /**
   * 1 = Create associative dimensioning
   * 0 = Draw individual entities
   * Note: Obsolete; see DIMASSOC.
   */
  DIMASO?: number
  /**
   * Controls the associativity of dimension objects
   * Initial value:	2
   * - 0: Creates exploded dimensions; there is no association between elements of the dimension, and the lines, arcs, arrowheads, and text of a dimension are drawn as separate objects
   * - 1:  Creates non-associative dimension objects; the elements of the dimension are formed into a single object, and if the definition point on the object moves, then the dimension value is updated
   * - 2: Creates associative dimension objects; the elements of the dimension are formed into a single object and one or more definition points of the dimension are coupled with association points on geometric objects
   */
  DIMASSOC?: number
  /**
   * Controls the size of dimension line and leader line arrowheads. Also controls the size of hook lines.
   * Multiples of the arrowhead size determine whether dimension lines and text should fit between the
   * extension lines. DIMASZ is also used to scale arrowhead blocks if set by DIMBLK. DIMASZ has no effect
   * when DIMTSZ is other than zero.
   * Initial value:	0.1800 (imperial) or 2.5000 (metric)
   */
  DIMASZ?: number
  /**
   * Determines how dimension text and arrows are arranged when space is not sufficient to place both within
   * the extension lines.
   * Initial value:	3
   * - 0: Places both text and arrows outside extension lines
   * - 1: Moves arrows first, then text
   * - 2: Moves text first, then arrows
   * - 3: Moves either text or arrows, whichever fits best
   */
  DIMATFIT?: number
  /**
   * Angle format for angular dimensions
   * Initial value:	0
   * - 0: Decimal degrees
   * - 1: Degrees/minutes/seconds
   * - 2: Gradians
   * - 3: Radians
   * - 4: Surveyor's units
   */
  DIMAUNIT?: number
  /**
   * Suppresses zeros for angular dimensions
   * Initial value:	0
   * - 0: Displays all leading and trailing zeros
   * - 1: Suppresses leading zeros in decimal dimensions (for example, 0.5000 becomes .5000)
   * - 2: Suppresses trailing zeros in decimal dimensions (for example, 12.5000 becomes 12.5)
   * - 3: Suppresses leading and trailing zeros (for example, 0.5000 becomes .5)
   */
  DIMAZIN?: number
  /**
   * Sets the arrowhead block displayed at the ends of dimension lines.
   * To return to the default, closed-filled arrowhead display, enter a single period (.).
   * Arrowhead block entries and the names used to select them in the New, Modify, and Override
   * Dimension Style dialog boxes are shown below. You can also enter the names of user-defined
   * arrowhead blocks.
   * Initial value:	""
   * - "": closed filled
   * - "_DOT": dot
   * - "_DOTSMALL": dot small
   * - "_DOTBLANK": dot blank
   * - "_ORIGIN": origin indicator
   * - "_ORIGIN2": origin indicator 2
   * - "_OPEN": open
   * - "_OPEN90": right angle
   * - "_OPEN30": open 30
   * - "_CLOSED": closed
   * - "_SMALL": dot small blank
   * - "_NONE": none
   * - "_OBLIQUE": oblique
   * - "_BOXFILLED": box filled
   * - "_BOXBLANK": box
   * - "_CLOSEDBLANK": closed blank
   * - "_DATUMFILLED": datum triangle filled
   * - "_DATUMBLANK": datum triangle
   * - "_INTEGRAL": integral
   * - "_ARCHTICK": architectural tick
   */
  DIMBLK?: string
  /**
   * The arrowhead for the first end of the dimension line when DIMSAH is on.
   * Initial value:	""
   */
  DIMBLK1?: string
  /**
   * The arrowhead for the second end of the dimension line when DIMSAH is on.
   * Initial value:	""
   */
  DIMBLK2?: string

  /**
   * Controls drawing of circle or arc center marks and centerlines by the DIMCENTER, DIMDIAMETER, and DIMRADIUS commands.
   * Initial value:	0.0900 (imperial) or 2.5000 (metric)
   * - 0: No center marks or lines are drawn
   * - <0: Centerlines are drawn
   * - >0: Center marks are drawn
   */
  DIMCEN?: number
  /**
   * Dimension line color: range is 0 = BYBLOCK; 256 = BYLAYER
   * Initial value:	0
   */
  DIMCLRD?: number
}
